'use strict';

const _ = require('lodash')
	, Kefir = require('kefir')
	;

module.exports = class View {
	constructor(changes, keys) {
		changes = changes || Kefir.never();
		keys = keys || [];

		this.events = Kefir.stream(this._subscribe.bind(this));
		this.changes = changes
			.map(v => _.pick(v, keys))
			.filter(v => !_.isEmpty(v))
			.onValue(v => this._refresh(v));

		this._data = {};

		this.component = this.component.bind(this);
		this._clean = this._clean.bind(this);
		this._render = this._render.bind(this);
	}

	component(emit, refresh) {
		this._dC_refresh = refresh;
		return {
			cleanup: this._clean,
			render: this._render
		};
	}

	_clean() {
		this._emitter.end();
	}

	_emit(v) {
		this._emitter.emit(v);
	}

	_refresh(data) {
		this._data = data;
		if(this._dC_refresh) this._dC_refresh();
	}

	_render() {
		return [];
	}

	_subscribe(emitter) {
		this._emitter = emitter;
	}
};
