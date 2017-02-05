'use strict';

const w = require('window')
	, domChanger = require('domchanger')
	, RootView = require('../views/RootView')
	;

module.exports = changes => {
	// init domChanger
	const root = new RootView(changes);
	domChanger(root.component, w.document.body).update();
	return root.events;
};
