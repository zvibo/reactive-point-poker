'use strict';

const TextInputView = require('./TextInputView')
		;

module.exports = class NameView extends TextInputView {
	constructor(changes) {
		super(changes, 'name', 'user', 'name');
	}
};
