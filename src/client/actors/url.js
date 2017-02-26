import _ from 'lodash';
import w from 'window';
import event$ from '../lib/event$';
import Kefir from 'kefir';

export default changes => {
	event$(changes, 'room')
		.filter(_.isString)
		.filter(room => room !== w.location.pathname.substr(1))
		.onValue(room => w.history.pushState(room, room ? room : 'lobby', `/${room}`));

	return Kefir.merge([
		Kefir.fromEvents(w, 'popstate', e => e.state), // emit room when user changes history position
		changes.map(() => 1).skipDuplicates().map(() => w.location.pathname.substr(1)) // emit room on initial state
	]).map(room => ({'submit:room':room}));
};
