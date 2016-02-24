/* globals window, document */

'use strict';

//require("babel-polyfill");

const domChanger = require('domchanger');
const Firebase = require('firebase');
const Kefir = require('kefir');

const data = window.data || {};

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
		// const topicRef = new Firebase(`${data.db_url}/rooms/${data.room}/topic`);
		// const topicStream = Kefir.fromEvents(topicRef, 'value');
		// topicStream.onValue(snap => instance.update(snap.val()));
		const myUserRef = new Firebase(`${data.db_url}/${data.room}/users/${auth.uid}`);
		myUserRef.onDisconnect().remove();
		myUserRef.set({vote:'0',name:'Josh'});

		const usersRef = new Firebase(`${data.db_url}/${data.room}/users`);
		const userStream = Kefir.fromEvents(usersRef, 'value').map(snap => {
			let obj = snap.val();
			let users = [];
			for (let u in obj) {
				users.push(obj[u]);
			}
			return users;
		});
		userStream.onValue(users => {
			console.log(users);
			instance.update(users);
		});
	});
}
else {
	instance.update('no room');
}
