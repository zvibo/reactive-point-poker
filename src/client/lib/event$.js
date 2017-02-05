'use strict';

module.exports = (source, name) => source.filter(e => _.has(e, name)).map(e => e[name]);
