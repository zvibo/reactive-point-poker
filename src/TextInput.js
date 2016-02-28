'use strict';

const Element = require('./Element');

module.exports = class TextInput extends Element {
	_render(text) {
		return ['input', {
			oninput: e => this._emit(e.target.value),
			type: 'text',
			value: text
		}];
	}
};
