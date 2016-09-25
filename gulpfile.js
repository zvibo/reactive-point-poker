var gulp = require('gulp');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var stylus = require('gulp-stylus');
var nib = require('nib');
var webpack = require('webpack-stream');
var webpack_config = require('./webpack.config.js');

gulp.task('css', function() {
	return gulp.src('src/styl')
		.pipe(stylus({
			 use: nib(),
			 import: ['nib']
		 }))
		.pipe(gulp.dest('public/css'))
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
	gulp.watch('src/client/**/*.js', ['webpack']);
});

gulp.task('build', ['css', 'webpack']);
gulp.task('default', ['build', 'watch']);
