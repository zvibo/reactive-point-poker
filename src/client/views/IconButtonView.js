import View from '../lib/View';
import w from 'window';

export default class IconButtonView extends View {
	constructor(changes, name, className) {
		super(changes);
		this.name = name;
		this.className = className || name;
		this.events = this.events.map(() => ({'click': this.name}));
	}

	_render() {
		const elem = w.document.createElement('span');
		elem.innerHTML = `<svg><use xlink:href="/img/icons.svg#${this.name}" /></svg>`;

		return ['button', {
			class: this.className,
			onclick: () => this._emit(true)
		},
			elem
		];
	}
}
