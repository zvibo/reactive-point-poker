import View from '../lib/View';
import Kefir from 'kefir';
import w from 'window';

export default class TextInputView extends View {
	constructor(changes, name, className, placeholder) {
		super(changes, [name]);
		this.name = name;
		this.className = className || name;
		this.placeholder = placeholder || name;
		this.events = Kefir.merge([
			this.events
				.filter(v => v.startsWith('input:'))
				.map(v => v.replace('input:',''))
				.map(v => ({[`set:${this.name}`]: v})),
			this.events
				.filter(v => v.startsWith('change:'))
				.map(v => v.replace('change:',''))
				.map(v => ({[`submit:${this.name}`]: v}))
		]);
		this.canvas = w.document.createElement('canvas');
	}

	measure(v) {
		let context = this.canvas.getContext('2d');
		context.font = 'bold 24pt sans-serif';
		let metrics = context.measureText(v);
		return metrics.width;
	}

	_render() {
		const value = this._data[this.name] ? this._data[this.name] : this.placeholder;

		return ['div', {
			class: `text-input ${this.className}`
		},
			['input', {
				oninput: e => {
					e.target.style = `width: calc(${this.measure(e.target.value.length ? e.target.value : this.placeholder)}px + 0.5rem)`;
					this._emit(`input:${e.target.value}`);
				},
				onchange: e => this._emit(`change:${e.target.value}`),
				type: 'text',
				placeholder: ' ',
				style: `width: calc(${this.measure(value)}px + 0.5rem)`,
				value: this._data[this.name]
			}],
			['label', {}, this.placeholder]
		];
	}
}
