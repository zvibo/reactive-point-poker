'use strict';

const _ = require('lodash')
	, ls = require('local-storage')
	, Firebase = require('firebase')
	, Kefir = require('kefir')
 	, RootView = require('./RootView')
	;

const snaps = function(ref) {
	return Kefir.fromEvents(ref, 'value');
};

module.exports = class Orchestrator {
	constructor(data, document) {
		this.db = new Firebase(data.db_url);
		this.changes = Kefir.pool();
		this.view = new RootView(document.body, this.changes);

		this.auth = Kefir.stream(emitter => {
			this.db.onAuth(authObj => {
				if(authObj) {
					emitter.emit(authObj);
				}
				else {
					emitter.error();
				}
			});
		});

		this.auth.onError(e => {
			this.db.authAnonymously();
		});

		Kefir.combine([
			this.auth.filter().map(v => v.uid),
			Kefir.constant(data.room)
		]).onValue((args => {
			this._setup(...args);
		}));

		this.db.authAnonymously();
	}

	_setup(id, room) {
		this.room = this.db.child(room);
		this.users = this.room.child('users');
		this.user = this.room.child(`users/${id}`);
		this.userName = this.user.child('name');
		this.userVote = this.user.child('vote');

		this.changes.plug(
			snaps(this.users).map(
				snap => ({ users: _.values(snap.val()) })
			)
		);

		this.changes.plug(
			snaps(this.userName).map(
				snap => ({ name: snap.val() })
			)
		);

		this.changes.plug(
			snaps(this.userVote).map(
				snap => ({ vote: snap.val() })
			)
		);

		this.storeKey = `pk/${room}`;
		this.user.onDisconnect().remove();

		this._setupActions(this.view.events);
	}

	_setupActions(events) {
		const key = `${this.storeKey}/name`;
		const nameEvents = events.filter(e => _.has(e,'change:name')).map(e => e['change:name']);

		Kefir.merge([
			Kefir.constant(ls(key)),
			Kefir.fromEvents(ls, key),
			nameEvents
		]).filter(name => _.isString(name)).onValue(name => {
			this.userName.set(name);
			ls(key, name);
		});
	}
};
