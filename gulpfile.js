const gulp = require('gulp')
	, ejs = require('gulp-ejs')
	, livereload = require('gulp-livereload')
	, nodemon = require('gulp-nodemon')
	, stylus = require('gulp-stylus')
	, svgmin = require('gulp-svgmin')
	, svgstore = require('gulp-svgstore')
	, nib = require('nib')
	, webpack = require('webpack-stream')
	, webpack_config = require('./webpack.config.js')
	;

const config = name => typeof process.env[name] !== 'undefined' ? process.env[name] : require('./env.json')[name];

gulp.task('css', function() {
	return gulp.src('src/styl/app.styl')
		.pipe(stylus({
			use: nib(),
			import: ['nib']
		}))
		.pipe(gulp.dest('public/css'))
		.pipe(livereload());
});

gulp.task('html', function() {
	return gulp.src('src/ejs/*.ejs')
		.pipe(ejs({
			data: {
				defaultVotes: config('default_votes'),
				env: config('NODE_ENV'),
				firebase: {
					apiKey: config('FIREBASE_KEY'),
					authDomain: config('FIREBASE_DOMAIN'),
					databaseURL: config('FIREBASE_DBURL'),
					storageBucket: config('FIREBASE_STORE')
				}
			}
		}, {}, { ext: '.html' }))
		.pipe(gulp.dest('public'))
		.pipe(livereload());
});

gulp.task('svg', function() {
	return gulp.src('src/icons/*.svg')
		.pipe(svgmin())
		.pipe(svgstore())
		.pipe(gulp.dest('public/img/'))
		.pipe(livereload());
});

gulp.task('webpack', function() {
	return gulp.src('src/client/main.js')
		.pipe(webpack(webpack_config))
		.pipe(gulp.dest('public/js/'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	nodemon().on('restart', function() {
		gulp.src('src/server/app.js')
			.pipe(livereload());
	});
	gulp.watch('src/styl/**/*.styl', ['css']);
	gulp.watch('src/server/views/*.ejs', ['html']);
	gulp.watch('src/img/**/*.svg', ['svg']);
	gulp.watch('src/client/**/*.js', ['webpack']);
});

gulp.task('build', ['css', 'html', 'svg', 'webpack']);
gulp.task('default', ['build', 'watch']);
