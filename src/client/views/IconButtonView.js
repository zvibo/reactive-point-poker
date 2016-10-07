'use strict';

const View = require('../lib/View')
		, w = require('window')
		;

module.exports = class IconButtonView extends View {
	constructor(changes, name, className) {
		super(changes);
		this.name = name;
		this.className = className || name;
		this.events = this.events.map(vote => ({'click': this.name}));
	}

	_render() {
		const elem = w.document.createElement('span');
		elem.innerHTML = `<svg><use xlink:href="/img/icons.svg#${this.name}" /></svg>`;

		return ['button', {
			class: this.className,
			onclick: e => this._emit(true)
		},
			elem
		];
	}
};
