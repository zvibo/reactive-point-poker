'use strict';

const Kefir = require('kefir')
	, View = require('../lib/View')
	, ArenaView = require('./ArenaView')
	, DeckView = require('./DeckView')
	, NameView = require('./NameView')
	;

module.exports = class RootView extends View {
	constructor(changes) {
		super(changes);
		this.events = Kefir.pool();

		this.nameView = new NameView(changes);
		this.events.plug(this.nameView.events);

		this.arenaView = new ArenaView(changes);
		this.events.plug(this.arenaView.events);

		this.deckView = new DeckView(changes);
		this.events.plug(this.deckView.events);
	}

	_render() {
		return ['div', {class: 'main'},
			[this.nameView.component],
			[this.arenaView.component],
			[this.deckView.component]
		];
	}
};
