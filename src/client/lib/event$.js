import has from 'lodash/has';

export default (source, name) => source.filter(e => has(e, name)).map(e => e[name]);
