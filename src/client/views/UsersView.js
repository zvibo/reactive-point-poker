'use strict';

const View = require('../lib/View');

module.exports = class UsersView extends View {
	constructor(changes) {
		super(changes, ['users']);
	}

	_render() {
		if(this._data.users) {
			const num = this._data.users.length;
			return ['ul',
				this._data.users.map((u,i) => {
					let angle = (i/num + 1/(num*2)) * Math.PI;
					return ['li', {
						class: 'player',
						style: `left: ${50 + Math.cos(angle)*50}%; top: ${(1 - Math.sin(angle))*100}%;`
					}, `${u.name}: ${u.vote === undefined ? '' : u.vote}`];
				}
			)];
		}
		return ['ul'];
	}
};
