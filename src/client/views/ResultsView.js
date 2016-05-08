'use strict';

const _ = require('lodash')
	, Kefir = require('kefir')
	, View = require('../lib/View')
	;

module.exports = class ResultsView extends View {
	constructor(changes) {
		super(changes, ['users'], stream => {
			return stream
				.map(data => data.users).filter()
				.flatten(user => user.vote !== undefined ? [user.vote] : [])
				.scan((counts, vote) => {
					counts[vote] = counts[vote] ? counts[vote] + 1 : 1;
					return counts;
				}, {})
				.map(votes => {
					return {
						votes: _.sortBy(_.keys(votes)),
						total: _.reduce(votes, (total, vote) => total + vote, 0)
					};
				});
		});
	}

	_render() {
		return ['ul', this._data.votes.map(
			vote => ['li', {
				style: `font-size: ${(this._data.votes[vote] / this._data.total) * 100}%;`
			}, vote]
		)];
	}
};
