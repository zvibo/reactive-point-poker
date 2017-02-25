import 'firebase/auth';
import 'firebase/database';

import _ from 'lodash';
import firebase from 'firebase/app';
import event$ from '../lib/event$';
import Kefir from 'kefir';

export default changes => {
	let roomRef, userRef, refs = [];

	// init firebase
	const app$ = event$(changes, 'firebase')
		.filter(_.isObject)
		.map(config => firebase.initializeApp(config))
		.filter();

	// init auth
	const auth$ = app$.map(app => app.auth());
	const authUser$ = auth$.flatMap(auth => Kefir.stream(e => auth.onAuthStateChanged(e.emit)));

	// sign in user if they aren't
	auth$.sampledBy(authUser$.filter(_.isNull))
		.onValue(auth => auth.signInAnonymously());

	// init updates
	event$(changes, 'show_votes').filter(_.isBoolean).onValue(show_votes => roomRef ? roomRef.update({show_votes}) : roomRef);
	event$(changes, 'topic').filter(_.isString).onValue(topic => roomRef ? roomRef.update({topic}) : roomRef);
	event$(changes, 'users').filter(_.isObject).onValue(users => roomRef ? roomRef.update({users}) : roomRef);
	event$(changes, 'votes').filter(_.isArray).onValue(votes => roomRef ? roomRef.update({votes}) : roomRef);
	event$(changes, 'vote').filter(_.isString).onValue(vote => userRef ? userRef.update({vote}) : userRef);

	// init room
	const room$ = app$.map(app => app.database().ref())
		.combine(event$(changes, 'room').filter().skipDuplicates(),
			(db, roomName) => db.child(roomName)
		).filter();

	// init user
	const user$ = Kefir.combine([room$, authUser$.filter().map(v => v.uid)], (room, userId) => room.child(`users/${userId}`));

	// handle special user name case
	Kefir.combine([user$.filter(), event$(changes, 'name').filter(_.isString)]).onValue(([user, name]) => user.update({name}));

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
				).skipDuplicates(_.isEqual)
			);
		});
};
