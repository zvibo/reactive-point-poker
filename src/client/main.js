/* globals window, document */

'use strict';

require("babel-polyfill");

const Orchestrator = require('./Orchestrator');

const data = window.data || {};

if(data.view === 'room') {
	new Orchestrator(data, document);
}
