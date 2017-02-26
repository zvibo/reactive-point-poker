import size from 'lodash/size';
import values from 'lodash/values';
import View from '../lib/View';

module.exports = class UsersView extends View {
	constructor(changes) {
		super(changes, ['users', 'show_votes']);
	}

	_render() {
		if(this._data.users) {
			const num = size(this._data.users);
			const users = values(this._data.users);

			return ['ul',
				users.map((u,i) => {
					let angle = (i/num + 1/(num*2)) * Math.PI;
					let left = 50 + Math.cos(angle)*50;
					let top = (1 - Math.sin(angle))*100;
					return ['li', {
						class: 'player',
						style: `
							left: ${left}%;
							top: ${top}%;
							transform: translate(${-left}%, ${-top}%);
						`
					},
						`${u.name}: `,
						['span', {
							class: this._data.show_votes ? '' : 'hidden'
						},
							`${u.vote === undefined ? '' : u.vote}`
						]
					];
				}
			)];
		}
		return ['ul'];
	}
};
