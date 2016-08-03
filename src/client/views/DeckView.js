'use strict';

const View = require('../lib/View');

module.exports = class DeckView extends View {
	constructor(changes) {
		super(changes, ['votes', 'vote']);
		this.events = this.events.map(vote => ({'change:vote': vote}));
	}

	_render() {
		if(this._data.votes) {
			return ['ul', {class:'deck'}, this._data.votes.map(v =>
				['li', {class:'card-wrapper'},
					['div', {class:'card'},
						['input', {
							id: `vote-${v}`,
							type: 'checkbox',
							name: 'votes',
							value: v,
							checked: v === this._data.vote,
							onchange: e => this._emit(e.target.checked ? e.target.value : '')
						}],
						['label', {
							for: `vote-${v}`
						}, v]
					]
				]
			)];
		}
		return ['ul'];
	}
};
