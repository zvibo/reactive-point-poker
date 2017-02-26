import isNull from 'lodash/isNull';
import mapValues from 'lodash/mapValues';
import set from 'lodash/set';
import Kefir from 'kefir';
import dom from './actors/dom';
import firebase from './actors/firebase';
import storage from './actors/storage';
import url from './actors/url';
import event$ from './lib/event$';

export default data => {
	const events = Kefir.pool();
	const changes = Kefir.pool();

	// activate (and log) the pools
	events.onAny(e => data.env === 'development' && console.log(`%ci: ${JSON.stringify(e[e.type])}`,'background:#fef'));
	changes.onAny(e => data.env === 'development' && console.log(`%co: ${JSON.stringify(e[e.type])}`,'background:#eff'));

	// simple change event to state change passthrough
	changes.plug(
		Kefir.constant(['name', 'show_votes', 'topic', 'users', 'vote']).flatten()
		.flatMap(key => event$(events, `change:${key}`).map(val => ({[key]:val})))
	);

	// simple set event to state change passthrough
	changes.plug(
		Kefir.constant(['name', 'topic', 'vote']).flatten()
		.flatMap(key => event$(events, `set:${key}`).map(val => ({[key]:val})))
	);

	// set room on submit
	changes.plug(event$(events, 'submit:room').skipDuplicates().map(room => ({room})));

	// set deck
	changes.plug(event$(events, 'change:votes').filter().map(votes => ({votes})));
	changes.plug(event$(events, 'change:votes').filter(isNull).map(() => ({votes: data.defaultVotes})));

	// reset action
	changes.plug(
		event$(events, 'change:users')
		.sampledBy(event$(events, 'click:reset'))
		.filter()
		.map(users => mapValues(users, user => set(user, 'vote', '')))
		.map(users => ({ show_votes: false, topic: '', users }))
	);

	// reveal action
	changes.plug(Kefir.constant({show_votes: true}).sampledBy(event$(events, 'click:reveal')));

	// connect actors
	events.plug(
		Kefir.constant([dom, firebase, storage, url]).flatten()
		.flatMap(actor => actor(changes))
	);

	// initial state
	changes.plug(Kefir.constant({
		firebase: data.firebase
	}));
};
