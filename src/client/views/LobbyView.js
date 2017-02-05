'use strict';

const Kefir = require('kefir')
	, View = require('../lib/View')
	//, RoomNameView = require('./RoomNameView')
	;

module.exports = class LobbyView extends View {
	constructor(changes) {
		super(changes);
		this.events = Kefir.pool();

		// this.roomNameView = new RoomNameView(changes);
		// this.events.plug(this.roomNameView.events);
	}

	_render() {
		return ['div', {class: 'main'},
			[]
		];
	}
};
