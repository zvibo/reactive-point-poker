'use strict';

const Kefir = require('kefir')
	, View = require('../lib/View')
	, ResultsView = require('./ResultsView')
	, UsersView = require('./UsersView')
	;

module.exports = class ArenaView extends View {
	constructor(changes) {
		super(changes);
		//this.events = Kefir.pool();

		this.usersView = new UsersView(changes);
		//this.events.plug(this.usersView.events);

		this.resultsView = new ResultsView(changes);
		//this.events.plug(this.resultsView.events);
	}

	_render() {
		return ['div', {class: 'arena'},
			[this.usersView.component],
			[this.resultsView.component]
		];
	}
};
