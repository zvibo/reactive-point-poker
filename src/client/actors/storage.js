import isString from 'lodash/isString';
import ls from 'local-storage';
import event$ from '../lib/event$';

export default changes => {
	// store name at pk/name
	event$(changes, 'name')
		.filter(isString)
		.skipDuplicates()
		.onValue(name => ls('pk/name', name));

	// emit name when room changes
	return event$(changes, 'room')
		.filter()
		.skipDuplicates()
		.map(() => ls('pk/name'))
		.map(name => ({'change:name': name}));
};
