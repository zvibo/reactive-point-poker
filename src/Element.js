'use strict';

const domChanger = require('domchanger');
const Kefir = require('kefir');

module.exports = class Element {
	constructor(owner, istream) {
		this.instance = domChanger(this.component.bind(this), owner);

		this.ostream = Kefir.stream(this._subscribe.bind(this));

		this.istream = istream || Kefir.never();
		this.istream.onValue((...args) => this.instance.update(...args));
	}

	component() {
		return {
			render: this._render.bind(this),
			cleanup: this._clean.bind(this)
		};
	}

	_clean() {
		this.emitter.end();
	}

	_emit(v) {
		this.emitter.emit(v);
	}

	_render() {
		return [];
	}

	_subscribe(emitter) {
		this.emitter = emitter;
	}
};
