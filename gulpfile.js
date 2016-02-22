var gulp = require('gulp');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack-stream');
var webpack_config = require('./webpack.config.js');

gulp.task('webpack', function() {
	return gulp.src('src/main.js')
		.pipe(webpack(webpack_config))
		.pipe(gulp.dest('public/js/'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	nodemon().on('restart', function() {
		gulp.src('app.js')
			.pipe(livereload());
	});
	gulp.watch('src/**/*.js', ['webpack']);
});

gulp.task('build', ['webpack']);
gulp.task('default', ['build', 'watch']);
