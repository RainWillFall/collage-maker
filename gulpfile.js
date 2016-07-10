var gulp = require('gulp'),
	concat = require('gulp-concat');

var scriptsSrc, scriptsDest, cssSrc, cssDest

gulp.task('scripts', function() {
	scriptsSrc = "./js/index.js";
	scriptsDest = "./js";

	return gulp.src(scriptsSrc)
				.pipe(concat('app.built.js'))
				.pipe(gulp.dest(scriptsDest))
});

gulp.task('stylesheets', function() {
	cssSrc = "./css/[_]*.css";
	cssDest = "./css";
	
	return gulp.src(cssSrc)
				.pipe(concat('app.built.css'))
				.pipe(gulp.dest(cssDest))
});

gulp.task('default', ['scripts', 'stylesheets'], function() {
	gulp.watch(scriptsSrc, ['scripts'])
	gulp.watch(cssSrc, ['stylesheets'])
});