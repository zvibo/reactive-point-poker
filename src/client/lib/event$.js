import _ from 'lodash';

export default (source, name) => source.filter(e => _.has(e, name)).map(e => e[name]);
