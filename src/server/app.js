"use strict";

const compression = require('compression');
const config = require('./config');
const express = require('express');
const path = require('path');

// setup app
const app = express();
app.set('port', config('PORT'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.normalize(__dirname+'/../../public')));
app.use(compression());

app.get('/', (req, res, next) => {
	res.locals.data = {
		firebase: {
			apiKey: config('FIREBASE_KEY'),
			authDomain: config('FIREBASE_DOMAIN'),
			databaseURL: config('FIREBASE_DBURL'),
			storageBucket: config('FIREBASE_STORE')
		},
		view: 'lobby'
	};
	next();
});

app.get('/:room', (req, res, next) => {
	res.locals.data = {
		firebase: {
			apiKey: config('FIREBASE_KEY'),
			authDomain: config('FIREBASE_DOMAIN'),
			databaseURL: config('FIREBASE_DBURL'),
			storageBucket: config('FIREBASE_STORE')
		},
		view: 'room',
		room: req.params.room
	};
	next();
});

// render the page
app.use((req,res,next) => res.render('index', {data: res.locals.data}));

// start the server
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
