'use strict';

const View = require('../lib/View')
		, w = require('window')
		;

module.exports = class NameView extends View {
	constructor(changes) {
		super(changes, ['name']);
		this.events = this.events.map(name => ({'change:name': name}));
		this.canvas = w.document.createElement('canvas');
		this.placeholder = 'name';
	}

	measure(v) {
		let context = this.canvas.getContext("2d");
		context.font = 'bold 3vh sans-serif';
		let metrics = context.measureText(v);
		return metrics.width;
	}

	_render() {
		const value = this._data.name ? this._data.name : this.placeholder;

		return ['div', {
				class:'user'
			},
			['input', {
				oninput: e => this._emit(e.target.value),
				type: 'text',
				placeholder: ' ',
				style: `width: calc(${this.measure(value)}px + 1rem)`,
				value: this._data.name
			}],
			['label', {}, this.placeholder]
		];
	}
};
