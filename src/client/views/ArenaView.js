import Kefir from 'kefir';
import View from '../lib/View';
import ControlView from './ControlView';
import ResultsView from './ResultsView';
import UsersView from './UsersView';

export default class ArenaView extends View {
	constructor(changes) {
		super(changes, ['show_votes']);
		this.events = Kefir.pool();

		this.usersView = new UsersView(changes);
		//this.events.plug(this.usersView.events);

		this.controlView = new ControlView(changes);
		this.events.plug(this.controlView.events);

		this.resultsView = new ResultsView(changes);
		//this.events.plug(this.resultsView.events);
	}

	_render() {
		return ['div', {class: `arena ${this._data.show_votes ? '' : 'hide_votes'}`},
			[this.usersView.component],
			[this.controlView.component],
			[this.resultsView.component]
		];
	}
}
