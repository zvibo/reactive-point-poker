import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import values from 'lodash/values';
import View from '../lib/View';

export default class ResultsView extends View {
	constructor(changes) {
		super(changes, ['users'], stream => {
			return stream
				.map(data => data.users)
				.filter()
				.map(values)
				.map(users => filter(users, user => user.vote !== undefined))
				.map(users => users.map(user => user.vote))
				.map(votes => countBy(votes))
				.map(counts => map(counts, (count, vote) => ({vote,count}) ))
				.map(votes => ({
					votes: sortBy(votes, o => parseFloat(o.vote)),
					total: sumBy(votes, 'count')
				}));
		});
	}

	_render() {
		if(this._data.votes) {
			return ['ul', {class: 'scoreboard'},
				this._data.votes.filter(v=>v!==undefined).map(
					vote => ['li', {
						style: `font-size: ${(vote.count / this._data.total) * 100}%;`
					}, vote.vote]
				)
			];
		}
		return ['ul'];
	}
}
