'use strict';

const _ = require('lodash')
	, Kefir = require('kefir')
	, View = require('../lib/View')
	;

module.exports = class ResultsView extends View {
	constructor(changes) {
		super(changes, ['users'], stream => {
			return stream
				.map(data => data.users)
				.filter()
				.map(users => _.filter(users, user => user.vote !== undefined))
				.map(users => users.map(user => user.vote))
				.map(votes => _.countBy(votes))
				.map(counts => _.map(counts, (count, vote) => ({vote,count}) ))
				.map(votes => ({
					votes: _.sortBy(votes, o => parseFloat(o.vote)),
					total: _.sumBy(votes, 'count')
				}));
		});
	}

	_render() {
		if(this._data.votes) {
			return ['ul', {class: 'scoreboard'},
				this._data.votes.filter(v=>v!==undefined).map(
					(vote, i) => ['li', {
						style: `font-size: ${(vote.count / this._data.total) * 100}%;`
					}, vote.vote]
				)
			];
		}
		return ['ul'];
	}
};
