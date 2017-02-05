'use strict';

const Kefir = require('kefir')
	, View = require('../lib/View')
	, LobbyView = require('./LobbyView')
	, RoomView = require('./RoomView')
	;

module.exports = class RootView extends View {
	constructor(changes) {
		super(changes, ['view']);
		this.events = Kefir.pool();

		this.lobbyView = new LobbyView(changes);
		this.events.plug(this.lobbyView.events);

		this.roomView = new RoomView(changes);
		this.events.plug(this.roomView.events);
	}

	_render() {
		if(this._data.view === 'lobby') {
			return [this.lobbyView.component];
		}
		else {
			return [this.roomView.component];
		}
	}
};
