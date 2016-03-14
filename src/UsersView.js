'use strict';

const View = require('./View');

module.exports = class UsersView extends View {
	constructor(changes) {
		super(changes, ['users']);
	}

	_render() {
		if(this._data.users) {
			return ['ul', this._data.users.map(u =>
				['li', `${u.name}: ${u.vote}`]
			)];
		}
		return [];
	}
};
