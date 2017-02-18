import Kefir from 'kefir';
import View from '../lib/View';
import ArenaView from './ArenaView';
import DeckView from './DeckView';
import NameView from './NameView';

export default class RoomView extends View {
	constructor(changes) {
		super(changes, ['room'], s=>s, Kefir.pool());

		this.nameView = new NameView(changes);
		this.events.plug(this.nameView.events);

		this.arenaView = new ArenaView(changes);
		this.events.plug(this.arenaView.events);

		this.deckView = new DeckView(changes);
		this.events.plug(this.deckView.events);
	}

	_render() {
		return ['div', {class: `main ${this._data.room ? '' : 'lobby'}`},
			[this.nameView.component],
			[this.arenaView.component],
			[this.deckView.component]
		];
	}
}
