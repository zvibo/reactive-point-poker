'use strict';

const View = require('./View');

module.exports = class NameView extends View {
	constructor(changes) {
		super(changes, ['name']);
		this.events = this.events.map(name => ({'change:name': name}));
	}

	_render() {
		return ['input', {
			oninput: e => this._emit(e.target.value),
			type: 'text',
			value: this._data.name
		}];
	}
};
