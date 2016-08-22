'use strict';

var fs = require('fs');
var gulp = require('gulp');
var jade = require('jade');
var app = require('./index');
var ext = require('gulp-ext-replace');
var gulpJade = require('gulp-jade');

// Native testing
var render = jade.renderFile('tests/src/index.jade', { pretty: '    ' });
fs.writeFileSync("tests/output/index.blade.php", render);


// Gulp testing
gulp.task('default', function () {
    return gulp
        .src('tests/src/**/*.jade')
        .pipe(gulpJade({ pretty: '    ' }))
        .pipe(ext('.blade.php'))
        .pipe(gulp.dest('./tests/output'));
});

gulp.task('watch', function () {
    gulp.watch('./tests/**/*.jade', ['default']);
});
