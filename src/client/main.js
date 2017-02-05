'use strict';

require('babel-polyfill');

const conductor = require('./conductor')
		, w = require('window')
		;

conductor(w.data || {});
