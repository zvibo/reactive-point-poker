/* globals window, document */

'use strict';

require("babel-polyfill");

const _ = require('lodash')
	, domChanger = require('domchanger')
	, ls = require('local-storage')
	, Firebase = require('firebase')
	, Kefir = require('kefir')
	, TextInput = require('./TextInput')
	;

const data = window.data || {};

const snaps = function(ref) {
	return Kefir.fromEvents(ref, 'value');
};

// Defining the component
function Echo() {
	return { render: users => {
			return ['ul', users.map(u =>
				['li', `${u.name}: ${u.vote}`]
			)];
		}
	};
}

// Creating a instance attached to document.body
const instance = domChanger(Echo, document.body);

if(data.room) {
	const db = new Firebase(data.db_url);
	const authUpdate = Kefir.stream(emitter => db.onAuth(auth => emitter.emit(auth)));
	const authStream = Kefir.merge([Kefir.constant(db.getAuth()), authUpdate]);

	authStream.onValue(auth => {
		if(!auth) {
			db.authAnonymously();
			return;
		}

		const room = db.child(data.room);
		const topic = room.child('topic');

		const users = snaps(room.child('users')).map(snap => _.values(snap.val()));
		users.onValue(users => {
			instance.update(users);
		});

		const me = room.child(`users/${auth.uid}`);
		me.onDisconnect().remove();
		me.set({vote:'0'});

		const myName = me.child('name');
		const nameKey = `${data.room}/name`;
		const nameView = new TextInput(document.body, snaps(myName).map(snap => snap.val()));
		Kefir.merge([
			Kefir.constant(''),
			Kefir.constant(ls(nameKey)),
			Kefir.fromEvents(ls, nameKey),
			nameView.ostream
		]).filter(x => !!x).onValue(name => myName.set(name));
		nameView.ostream.onValue(name => ls(nameKey, name));
	});
}
else {
	instance.update([]);
}
