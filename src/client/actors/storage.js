'use strict';

const _ = require('lodash')
	, ls = require('local-storage')
	, event$ = require('../lib/event$')
	, Kefir = require('kefir')
	;

const roomKey = room => `pk/${room}/name`;

module.exports = changes => {
	// store name at pk/$room/name
	Kefir.combine([
		event$(changes, 'room')
			.filter(_.isString)
			.map(roomKey),
		event$(changes, 'name')
			.filter(_.isString)
	]).sampledBy(event$(changes, 'name'))
		.onValue(streams => ls(...streams));

	// emit name when room changes
	return event$(changes, 'room')
		.filter()
		.map(roomKey)
		.map(ls)
		.map(name => ({'change:name': name}));
};
