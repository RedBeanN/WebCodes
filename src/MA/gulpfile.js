var gulp = require('gulp');

var jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');

gulp.task('lint', function () {
  gulp.src(['./public/javascripts/app.js', './public/javascripts/controllers.js',
    './public/javascripts/directive.js']).
    pipe(jshint()).
    pipe(jshint.reporter('default'));
});

gulp.task('clientJS', function () {
  gulp.src('./public/javascripts/*.js').
    pipe(concat('app.js')).
    pipe(gulp.dest('./dev/concat')).
    pipe(rename('app.min.js')).
    // pipe(uglify()).
    pipe(gulp.dest('./public/min'));//.
    // pipe(rev()).
    // pipe(gulp.dest('./public/min/rev')).
    // pipe(rev.manifest()).
    // pipe(gulp.dest('./dev/rev'));
});

gulp.task('libJS', function () {
  gulp.src('./public/javascripts/lib/*.js').
    pipe(concat('lib.js')).
    pipe(gulp.dest('./dev/concat')).
    pipe(rename('lib.min.js')).
    pipe(uglify()).
    pipe(gulp.dest('./public/min'));
});

gulp.task('css', function () {
  gulp.src('./public/stylesheets/*.css').
    pipe(concat('style.css')).
    pipe(gulp.dest('./dev/concat')).
    pipe(rename('style.min.css')).
    pipe(cssnano()).
    pipe(gulp.dest('./public/min'));//.
    // pipe(rev()).
    // pipe(gulp.dest('./public/min/rev')).
    // pipe(rev.manifest()).
    // pipe(gulp.dest('./dev/rev'));
});

gulp.task('rev', function () {
  gulp.src(['./dev/rev/*.json', './views/*.jade']).
    pipe(revCollector()).
    pipe(gulp.dest('./views'));
})

gulp.task('default',['lint', 'clientJS', 'css'] , function () {
  gulp.watch('./public/javascripts/*.js',['lint', 'clientJS']);
  gulp.watch('./public/stylesheets/*.css',['css']);
  gulp.watch('./public/javascripts/lib/*.js',['libJS']);
});