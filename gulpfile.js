'use strict';

var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var paths = {
  scripts: ['./js/**/*.js'],
  tests: ['./test/spec/*.js']
}

gulp.task('test', function () {
  gulp.src('test/index.html')
    .pipe(mochaPhantomJS({ reporter: 'min' }));
});

gulp.task('watch', function () {
  gulp.watch([].concat(paths.scripts, paths.tests), ['test']);
});

gulp.task('default', ['test', 'watch']);
