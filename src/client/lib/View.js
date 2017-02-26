import defaults from 'lodash/defaults';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import Kefir from 'kefir';

export default class View {
	constructor(changes = Kefir.never(), keys = [], modifier = s => s, events) {
		this.events = events || Kefir.stream(this._subscribe.bind(this));

		this.changes =
			modifier(
				changes.map(
					v => pick(v, keys)
				).filter(
					v => !isEmpty(v)
				)
			).onValue(
				v => this._refresh(v)
			);

		this.component = this.component.bind(this);
		Object.defineProperty(this.component, 'name', { writable: true });
		this.component.name = this.constructor.name;

		this._clean = this._clean.bind(this);
		this._render = this._render.bind(this);

		this._data = {};
	}

	component(emit, refresh) {
		this._dC_refresh = refresh;
		return {
			cleanup: this._clean,
			render: this._render
		};
	}

	_clean() {
		this._emitter && this._emitter.end();
	}

	_emit(v) {
		this._emitter && this._emitter.emit(v);
	}

	_refresh(data) {
		this._data = defaults(data, this._data);
		if(this._dC_refresh) this._dC_refresh();
	}

	_render() {
		return [];
	}

	_subscribe(emitter) {
		this._emitter = emitter;
	}
}
