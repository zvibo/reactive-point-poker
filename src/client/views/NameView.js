import w from 'window';
import Kefir from 'kefir';
import View from '../lib/View';
import TextInputView from './TextInputView';

export default class NameView extends View {
	constructor(changes) {
		super(changes, ['room'], s=>s, Kefir.pool());

		this.nameView = new TextInputView(changes, 'name', 'user', 'name');
		this.events.plug(this.nameView.events);

		this.roomView = new TextInputView(changes, 'room');
		this.events.plug(this.roomView.events);
	}

	_render() {
		return ['div', {class: 'where'},
			[this.nameView.component],
			['span', '@'],
			['span', w.location.hostname],
			['span', '/'],
			[this.roomView.component]
		];
	}
}
