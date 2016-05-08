'use strict';

const View = require('../lib/View');

module.exports = class UsersView extends View {
	constructor(changes) {
		super(changes, ['users']);
	}

	_render() {
		if(this._data.users) {
			const num = this._data.users.length;
			return ['ul', {className: 'arena'},
				this._data.users.map((u,i) => {
					let angle = ((i-1)/num + 1/(num*2)) * Math.PI;
					return ['li', {
						style: `left: ${50 + Math.cos(angle)*50}%; top: ${100 - Math.sin(angle)*100}%;`
					}, `${u.name}: ${u.vote === undefined ? '' : u.vote}`];
				}
			)];
		}
		return ['ul'];
	}
};
