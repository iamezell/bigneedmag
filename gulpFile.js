'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');


gulp.task('default', ['nodemon'], function () {
});

// process JS files and return the stream.
gulp.task('js', function () {
        return browserify('./src/js/app.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./public/javascripts'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function(){
	console.log("changed")
	browserSync.reload();
});

gulp.task('start', ['nodemon'], function() {
    browserSync.init({
        proxy: "http://localhost:3000/",
        port: 5000,
        reloadDelay: 500,
        injectChanges: false
    });

    // all browsers reload after tasks are complete.
    gulp.watch(["src/js/*.js", "views/*.ejs"], ['js-watch']);
});

gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});
