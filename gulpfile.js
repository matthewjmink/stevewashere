var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    inject = require('gulp-inject'),
    series = require('stream-series'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    runSequence = require('run-sequence'),
    useref = require('gulp-useref');

var appConfig = {
    app: './app',
    index: './app/index.html',
    js: './app/**/*.js',
    css: './app/**/*.css',
    dist: './public',
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
    var ngModules = gulp.src(['./app/**/*module.js', appConfig.bower], {read: false});
    var js = gulp.src([appConfig.js, appConfig.bower, '!./app/**/*module.js'], {read: false});

    return gulp.src(appConfig.index)
        .pipe(inject(series(css, ngModules, js), {relative: true}))
        .pipe(gulp.dest(appConfig.app));
});

gulp.task('images', function(){
    return gulp.src(['./app/**/*.+(png|jpg|gif|svg)',appConfig.bower])
        .pipe(gulp.dest(appConfig.dist))
});

gulp.task('fonts', function(){
    return gulp.src('app/bower_components/bootstrap/dist/fonts/**.*')
        .pipe(gulp.dest(appConfig.dist + '/fonts'))
});

gulp.task('html', function(){
    return gulp.src(['app/**/*.html', '!./app/index.html', appConfig.bower])
        .pipe(gulp.dest(appConfig.dist))
});

gulp.task('useref', function(){
    return gulp.src(appConfig.index)
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest(appConfig.dist));
});

gulp.task('clean', function() {
    return del.sync(appConfig.dist);
})

gulp.task('index', ['bower', 'inject']);
gulp.task('default', function (callback) {
  runSequence('clean',
    ['useref', 'fonts', 'images', 'html'],
    callback
  )
});
