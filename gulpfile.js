var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var less = require('gulp-less');
var connect = require('gulp-connect');
var rename = require('gulp-rename');

gulp.task('copy', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('www/'));
});

gulp.task('less', function() {
    return gulp.src('./src/less/index.less')
        .pipe(less())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./www/'))
        .pipe(connect.reload());
});

gulp.task('build-js', function() {
    return browserify('./src/js/index.js')
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./www'))
        .pipe(connect.reload());
});

// Rerun tasks whenever a file changes.
gulp.task('watch', ['build'], function() {
    gulp.watch('./src/less/**/*', ['less']);
    gulp.watch('./src/js/**/*', ['build-js']);
});

// Development
gulp.task('serve', function() {
    connect.server({
        root      : 'www',
        host      : '*',
        port      : 8000,
        livereload: true
    });
});

gulp.task('build', ['copy', 'less', 'build-js']);
gulp.task('dev', ['build', 'serve', 'watch']);
