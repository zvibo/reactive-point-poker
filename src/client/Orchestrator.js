'use strict';

const _ = require('lodash')
	, ls = require('local-storage')
	, Firebase = require('firebase')
	, Kefir = require('kefir')
 	, RootView = require('./views/RootView')
	;

const default_deck = ['0','1','2','3','5','8','13','20','40','∞'];

module.exports = class Orchestrator {
	constructor(data, document) {
		this.db = new Firebase(data.db_url);
		this.changes = Kefir.pool();
		this.view = new RootView(document.body, this.changes);

		this.auth = Kefir.stream(e => this.db.onAuth(auth => auth ? e.emit(auth) : e.error()));
		this.auth.onError(e => this.db.authAnonymously());

		Kefir.combine([
			this.auth.filter().map(v => v.uid),
			Kefir.constant(data.room)
		]).onValue((args => {
			this._setup(...args);
		}));

		this.db.authAnonymously();
	}

	_plugChanges(reference, transform) {
		this.changes.plug(
			Kefir.fromEvents(reference, 'value').map(
				snap => ({ [reference.key()]: transform ? transform(snap.val()) : snap.val() })
			)
		);
	}

	_setup(id, room) {
		this.room = this.db.child(room);
		this.votes = this.room.child('votes');
		this.users = this.room.child('users');
		this.user = this.room.child(`users/${id}`);
		this.userName = this.user.child('name');
		this.userVote = this.user.child('vote');

		this._plugChanges(this.votes);
		this._plugChanges(this.users, _.values);
		this._plugChanges(this.userName);
		this._plugChanges(this.userVote);

		Kefir.fromEvents(this.votes, 'value').filter(snap => !snap.exists()).onValue(() => this.votes.set(default_deck));

		this.storeKey = `pk/${room}`;
		this.user.onDisconnect().remove();

		this._setupActions(this.view.events);
	}

	_setupActions(events) {
		const key = `${this.storeKey}/name`;
		const nameEvents = events.filter(e => _.has(e,'change:name')).map(e => e['change:name']);
		const voteEvents = events.filter(e => _.has(e,'change:vote')).map(e => e['change:vote']);

		Kefir.merge([
			Kefir.constant(ls(key)),
			Kefir.fromEvents(ls, key),
			nameEvents
		]).filter(name => _.isString(name)).onValue(name => {
			this.userName.set(name);
			ls(key, name);
		});

		voteEvents.filter(vote => _.isString(vote)).onValue(vote => this.userVote.set(vote));
	}
};
