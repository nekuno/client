var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

gulp.task('copy', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('www/'));
});

gulp.task('fonts', function() {
    return gulp.src('src/scss/fonts/*')
        .pipe(gulp.dest('www/fonts/'));
});

gulp.task('images', function() {
    return gulp.src(['src/scss/img/*', 'src/scss/img/**/*'])
        .pipe(gulp.dest('www/img/'));
});

gulp.task('sass', function() {
    var paths = [
        './node_modules/framework7/dist/css/framework7.ios.css',
        './node_modules/Framework7-3D-Panels/dist/framework7.3dpanels.css',
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
        './node_modules/framework7/dist/js/framework7.min.js',
        './node_modules/Framework7-3D-Panels/dist/framework7.3dpanels.min.js',
        './src/js/vendor/openfb.js',
        './src/js/vendor/hello.js',
        './src/js/vendor/socket.io.min.js'
    ];
    return gulp.src(paths)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./www'))
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

gulp.task('minify-js', ['build'], function() {
    return gulp.src('www/bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('./www'));
});

gulp.task('minify-css', ['sass'], function() {
    return gulp.src('www/bundle.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('./www'));
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

gulp.task('build', ['copy', 'fonts', 'images', 'sass', 'build-js', 'build-vendor-js']);
gulp.task('release', ['minify-js', 'minify-css']);
gulp.task('dev', ['build', 'serve', 'watch']);
