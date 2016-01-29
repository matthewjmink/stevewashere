var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    inject = require('gulp-inject'),
    series = require('stream-series'),
    useref = require('gulp-useref');

var appConfig = {
    app: './app',
    index: './app/index.html',
    js: './app/**/*.js',
    css: './app/**/*.css',
    dist: './dist',
    bower: '!./app/bower_components/**/*'
};

gulp.task('bower', function () {
    gulp.src(appConfig.index)
        .pipe(wiredep({
            exclude: [ /jquery/ ],
        }))
        .pipe(gulp.dest(appConfig.app));
});

gulp.task('inject', function () {
    var css = gulp.src([appConfig.css, appConfig.bower], {read: false});
    // Get only the Angular modules so we can inject them first
    var ngModules = gulp.src(['./app/**/*module.js', appConfig.bower], {read: false});
    // Ignore modules since we already have them
    var js = gulp.src([appConfig.js, appConfig.bower, '!./app/**/*module.js'], {read: false});

    return gulp.src(appConfig.index)
        .pipe(inject(series(css, ngModules, js), {relative: true}))
        .pipe(gulp.dest(appConfig.app));
});

gulp.task('useref', function () {
    return gulp.src(appConfig.index)
        .pipe(useref())
        .pipe(gulp.dest(appConfig.dist));
});

gulp.task('index', ['bower', 'inject']);
gulp.task('default', ['useref']);
