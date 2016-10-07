'use strict';

require("babel-polyfill");

const Orchestrator = require('./Orchestrator')
		, w = require('window')
		;

const data = w.data || {};

if(data.view === 'room') {
	new Orchestrator(data, w.document);
}
