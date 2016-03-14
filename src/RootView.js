'use strict';

const domChanger = require('domchanger')
	, Kefir = require('kefir')
	, View = require('./View')
 	, NameView = require('./NameView')
 	, UsersView = require('./UsersView')
	;

module.exports = class RootView extends View {
	constructor(owner, changes) {
		super(changes);
		this.events = Kefir.pool();

		this.nameView = new NameView(changes);
		this.events.plug(this.nameView.events);

		this.usersView = new UsersView(changes);
		this.events.plug(this.usersView.events);

		domChanger(this.component, owner).update();
	}

	_render() {
		return ['div',
			[this.nameView.component],
			[this.usersView.component]
		];
	}
};
