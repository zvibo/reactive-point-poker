import _ from 'lodash';
import ls from 'local-storage';
import event$ from '../lib/event$';
import Kefir from 'kefir';

const roomKey = room => `pk/${room}/name`;

export default changes => {
	// store name at pk/$room/name
	Kefir.combine([
		event$(changes, 'room')
			.filter(_.isString)
			.map(roomKey),
		event$(changes, 'name')
			.filter(_.isString)
	]).sampledBy(event$(changes, 'name'))
		.skipDuplicates(_.isEqual)
		.onValue(streams => ls(...streams));

	// emit name when room changes
	return event$(changes, 'room')
		.filter()
		.map(roomKey)
		.map(ls)
		.map(name => ({'change:name': name}));
};
