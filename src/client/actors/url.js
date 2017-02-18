import _ from 'lodash';
import w from 'window';
import event$ from '../lib/event$';
import Kefir from 'kefir';

export default changes => {
	event$(changes, 'room')
		.filter(_.isString)
		.filter(room => room !== w.location.pathname.substr(1))
		.onValue(room => w.history.pushState(room, room ? room : 'lobby', `/${room}`));

	return Kefir.fromCallback(cb => w.addEventListener('popstate', cb))
		.map(e => e.state)
		.map(room => ({'set:room':room}));
};
