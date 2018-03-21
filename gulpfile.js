var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var envify = require('envify');
var cleanCss = require('gulp-clean-css');
var gulpHtmlVersion = require('gulp-html-version');
var runSequence = require('run-sequence');

gulp.task('env-dev', function() {
    process.env.NODE_ENV = 'development';
});

gulp.task('env-prod', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('copy', function() {
    return gulp.src('src/*.html')
        .pipe(gulpHtmlVersion())
        .pipe(gulp.dest('www/'));
});

gulp.task('fonts', function() {
    return gulp.src('src/scss/fonts/*')
        .pipe(gulp.dest('www/fonts/'));
});

gulp.task('assets', function() {
    return gulp.src(['src/*.ico', 'src/*.png', 'src/manifest.json', 'src/google-services.json', 'src/GoogleService-Info.plist', 'src/*.svg', './node_modules/framework7/dist/js/framework7.min.js.map'])
        .pipe(gulp.dest('www/'));
});

gulp.task('images', function() {
    return gulp.src(['src/img/*', 'src/scss/img/*', 'src/scss/img/**/*'])
        .pipe(gulp.dest('www/img/'));
});

gulp.task('sass', function() {
    var paths = [
        './node_modules/framework7/dist/css/framework7.ios.css',
        './node_modules/Framework7-3D-Panels/dist/framework7.3dpanels.css',
        './node_modules/slick-carousel/slick/slick.css',
        './node_modules/react-image-crop/dist/ReactCrop.css',
        './node_modules/react-joyride/lib/react-joyride-compiled.css',
        './node_modules/react-infinite-calendar/styles.css',
        './node_modules/rc-slider/assets/index.css',
        './src/scss/pages/*.scss',
        './src/scss/*.scss'
    ];

    return gulp.src(paths)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./www/'))
        .pipe(connect.reload());
});

gulp.task('build-hello-js', function() {
    return gulp.src('./node_modules/hellojs/dist/hello.js')
        .pipe(gulp.dest('www/'));
});

gulp.task('build-js', function() {
    return browserify('./src/js/index.js')
        .transform(babelify)
        .transform(envify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./www'))
        .pipe(connect.reload());
});

gulp.task('build-service-worker', function() {
    return browserify('./src/js/firebase-messaging-sw.js')
        .transform(babelify)
        .bundle()
        .pipe(source('firebase-messaging-sw.js'))
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
        .pipe(cleanCss())
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
        port      : 80,
        livereload: true
    });
});

gulp.task('build', ['copy', 'fonts', 'assets', 'images', 'sass', 'build-js', 'build-service-worker', 'build-hello-js']);
gulp.task('minify', ['minify-js', 'minify-css']);
gulp.task('release', ['env-prod'], function() {
    runSequence('minify');
});
gulp.task('build-dev', ['build', 'serve', 'watch']);
gulp.task('dev', ['env-dev'], function() {
    runSequence('build-dev');
});
