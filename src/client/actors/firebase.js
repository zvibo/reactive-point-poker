import 'firebase/auth';
import 'firebase/database';

import isArray from 'lodash/isArray';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import firebase from 'firebase/app';
import event$ from '../lib/event$';
import Kefir from 'kefir';

export default changes => {
	let roomRef, userRef, refs = [];

	// init firebase
	const app$ = event$(changes, 'firebase')
		.filter(isObject)
		.map(config => firebase.initializeApp(config))
		.filter();

	// init auth
	const auth$ = app$.map(app => app.auth());
	const authUser$ = auth$.flatMap(auth => Kefir.stream(e => auth.onAuthStateChanged(e.emit)));

	// sign in user if they aren't
	auth$.sampledBy(authUser$.filter(isNull))
		.onValue(auth => auth.signInAnonymously());

	// init updates
	event$(changes, 'show_votes').filter(isBoolean).onValue(show_votes => roomRef && roomRef.update({show_votes}));
	event$(changes, 'topic').filter(isString).onValue(topic => roomRef && roomRef.update({topic}));
	event$(changes, 'users').filter(isObject).onValue(users => roomRef && roomRef.update({users}));
	event$(changes, 'votes').filter(isArray).onValue(votes => roomRef && roomRef.update({votes}));
	event$(changes, 'vote').filter(isString).onValue(vote => userRef && userRef.update({vote}));

	// init room
	const room$ = app$.map(app => app.database().ref())
		.combine(event$(changes, 'room').filter().skipDuplicates(),
			(db, roomName) => db.child(roomName)
		).filter();

	// init user
	const user$ = Kefir.combine([room$, authUser$.filter().map(v => v.uid)], (room, userId) => room.child(`users/${userId}`));

	// handle special user name case
	Kefir.combine([user$.filter(), event$(changes, 'name').filter(isString)]).onValue(([user, name]) => user.update({name}));

	return Kefir.combine([room$, user$])
		.flatMap(([room, user]) => {
			// drop references to old room
			if(roomRef) roomRef.off();
			roomRef = room;

			// remove user from old room and update user reference
			if(userRef) userRef.remove();
			userRef = user;
			user.onDisconnect().remove();

			// drop old references
			refs.map(ref => ref.off());
			refs = [
				room.child('show_votes'),
				room.child('users'),
				room.child('topic'),
				room.child('votes'),
				user.child('vote')
			];

			// return new streams
			return Kefir.constant(refs).flatten().flatMap(ref =>
				Kefir.fromEvents(ref, 'value').map(
					snap => ({ [`change:${snap.key}`]: snap.val() })
				).skipDuplicates(isEqual)
			);
		});
};
