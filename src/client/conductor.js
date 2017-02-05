'use strict';

const _ = require('lodash')
	, dom = require('./actors/dom')
	, firebase = require('./actors/firebase')
	, storage = require('./actors/storage')
	, event$ = require('./lib/event$')
	, Kefir = require('kefir')
	;

module.exports = data => {
	const events = Kefir.pool();
	const changes = Kefir.pool();

	const actors = [dom, firebase, storage];
	for (const actor of actors) {
		events.plug(actor(changes));
	}

	const changeEvents = ['name', 'show_votes', 'topic', 'users', 'vote', 'votes'];
	for (const key of changeEvents) {
		changes.plug(event$(events, `change:${key}`).map(val => ({[key]:val})));
	}

	changes.plug(
		event$(events, 'change:users')
		.sampledBy(event$(events, 'click:reset'))
		.filter()
		.map(users => _.mapValues(users, user => _.set(user, 'vote', '')))
		.map(users => ({ show_votes: false, topic: '', users }))
	);
	changes.plug(Kefir.constant({show_votes: true}).sampledBy(event$(events, 'click:reveal')));

	changes.plug(event$(events, 'set:name').map(name => ({name})));
	changes.plug(event$(events, 'set:room').map(room => ({room})));
	changes.plug(event$(events, 'set:topic').map(topic => ({topic})));
	changes.plug(event$(events, 'set:vote').map(vote => ({vote})));

	changes.plug(Kefir.constant({
		firebase: data.firebase,
		room: data.room
	}));
};
