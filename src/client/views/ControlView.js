'use strict';

const Kefir = require('kefir')
		, View = require('../lib/View')
		, IconButtonView = require('./IconButtonView')
		, TextInputView = require('./TextInputView')
		;

module.exports = class ControlView extends View {
	constructor(changes) {
		super(changes, ['issue']);
		this.issueInput = new TextInputView(changes, 'topic');
		this.resetButton = new IconButtonView(changes, 'refresh', 'reset');
		this.revealButton = new IconButtonView(changes, 'eye', 'reveal');
		this.events = Kefir.merge([
			this.issueInput.events,
			this.resetButton.events.map(() => ({'click:reset': true})),
			this.revealButton.events.map(() => ({'click:reveal': true}))
		]);
	}

	_render() {
		return ['div', {class:'control'},
			[this.issueInput.component],
			['div', {class:'buttons'},
				[this.resetButton.component],
				[this.revealButton.component]
			]
		];
	}
};
