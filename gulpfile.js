'use strict';

var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var paths = {
  scripts: [
    './src/js/stacked.js',
    './src/js/stacked/model/type/*.js',
    './src/js/stacked/model/*.js',
    './src/js/stacked/collection/**/*.js',
    './src/js/stacked/view/**/*.js'
  ],
  deps: [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/jquery-ui/ui/jquery-ui.js',
    './bower_components/jquery-ui/ui/jquery.ui.draggable.js',
    './bower_components/jquery-ui/ui/jquery.ui.droppable.js',
    './bower_components/underscore/underscore.js',
    './bower_components/backbone/backbone.js'
  ],
  tests: ['./test/spec/*.js']
}

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('clean', function () {
  gulp.src('./dist', { read: false })
    .pipe(clean());
})

gulp.task('scripts', function () {

  gulp.src(paths.deps)
    .pipe(concat('dependencies.min.js', { newLine: '\n\n' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));

  gulp.src(paths.scripts)
    .pipe(concat('stacked.js'))
    .pipe(concat.header("var Stacked;\n\n(function () {\n\n'use strict'\n"))
    .pipe(concat.footer('\n})();\n'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('stacked.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function () {
  gulp.src('test/index.html')
    .pipe(mochaPhantomJS({ reporter: 'min' }))
    .on('error', handleError);
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch([].concat(paths.scripts, paths.tests), ['test']);
});

gulp.task('default', ['scripts', 'test']);
