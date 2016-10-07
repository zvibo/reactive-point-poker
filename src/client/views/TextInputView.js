'use strict';

const View = require('../lib/View')
		, w = require('window')
		;

module.exports = class TextInputView extends View {
	constructor(changes, name, className, placeholder) {
		super(changes, [name]);
		this.name = name;
		this.className = className || name;
		this.placeholder = placeholder || name;
		this.events = this.events.map(val => ({[`change:${this.name}`]: val}));
		this.canvas = w.document.createElement('canvas');
	}

	measure(v) {
		let context = this.canvas.getContext("2d");
		context.font = 'bold 1rem sans-serif';
		let metrics = context.measureText(v);
		return metrics.width;
	}

	_render() {
		const value = this._data[this.name] ? this._data[this.name] : this.placeholder;

		return ['div', {
				class: `text-input ${this.className}`
			},
			['input', {
				oninput: e => this._emit(e.target.value),
				type: 'text',
				placeholder: ' ',
				style: `width: calc(${this.measure(value)}px + 1rem)`,
				value: this._data[this.name]
			}],
			['label', {}, this.placeholder]
		];
	}
};
