var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var rename = require('gulp-rename');

gulp.task('copy', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('www/'));
});

gulp.task('fonts', function() {
    gulp.src('src/scss/fonts/*')
        .pipe(gulp.dest('www/fonts/'));
});

gulp.task('sass', function() {
    var paths = [
        './node_modules/framework7/dist/css/framework7.ios.css',
        './src/scss/pages/*.scss',
        './src/scss/*.scss'
    ];

    return gulp.src(paths)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./www/'))
        .pipe(connect.reload());
});

gulp.task('build-vendor-js', function() {
    var paths = [
        './node_modules/framework7/dist/js/framework7.min.js'
    ];
    return gulp.src(paths)
        .pipe(rename('vendor.js'))
        .pipe(gulp.dest('./www'))
        .pipe(connect.reload());
});

gulp.task('build-js', ['build-vendor-js'], function() {
    return browserify('./src/js/index.js')
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./www'))
        .pipe(connect.reload());
});

// Rerun tasks whenever a file changes.
gulp.task('watch', ['build'], function() {
    gulp.watch('./src/scss/**/*', ['sass']);
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

gulp.task('build', ['copy', 'fonts', 'sass', 'build-js']);
gulp.task('dev', ['build', 'serve', 'watch']);
