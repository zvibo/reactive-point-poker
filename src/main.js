/* globals window, document */

'use strict';

//require("babel-polyfill");

const Firebase = require('firebase');
const domChanger = require('domchanger');

const data = window.data || {};

// Defining the component
function Echo() {
	return { render: (v) => ["div", v] };
}

// Creating a instance attached to document.body
const instance = domChanger(Echo, document.body);


if(data.room) {
	const roomRef = new Firebase(data.db_url + '/rooms/' + data.room);
	instance.update(data.room);
}
else {
	instance.update('no room');
}
