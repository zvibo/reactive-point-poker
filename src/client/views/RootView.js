'use strict';

const domChanger = require('domchanger')
	, Kefir = require('kefir')
	, View = require('../lib/View')
	, DeckView = require('./DeckView')
 	, NameView = require('./NameView')
	, ResultsView = require('./ResultsView')
 	, UsersView = require('./UsersView')
	;

module.exports = class RootView extends View {
	constructor(owner, changes) {
		super(changes);
		this.events = Kefir.pool();

		this.nameView = new NameView(changes);
		this.events.plug(this.nameView.events);

		this.usersView = new UsersView(changes);
		this.events.plug(this.usersView.events);

		this.resultsView = new ResultsView(changes);
		this.events.plug(this.resultsView.events);

		this.deckView = new DeckView(changes);
		this.events.plug(this.deckView.events);

		domChanger(this.component, owner).update();
	}

	_render() {
		return ['div',
			[this.nameView.component],
			[this.usersView.component],
			[this.resultsView.component],
			[this.deckView.component]
		];
	}
};
