/*
    Gulpfile - Develop and Build Application
 */

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    env = require('gulp-env'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    cssmin = require('gulp-cssmin');

// Compile SASS into CSS
gulp.task('sass', function () {
    gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

// Watch the frontend, rebuild when needed, tell livereload
gulp.task('watch', function () {
    gulp.watch('./public/css/*.scss', ['sass']);
});

// Run the server in development mode.
gulp.task('develop', function () {

    gutil.log(gutil.colors.green('Running App...'));

    // Inject environment variables from env.json
    env({
        file: 'env.json'
    });

    // start livereload
    livereload.listen();

    // nodemon needs to handle rebuilding the backend code and restarting the server
    nodemon({
        script: 'bin/www',
        ext: 'js jade coffee',
        stdout: false
    }).on('readable', function () {
        // if we successfully restarted, tell livereload to reload the page.
        this.stdout.on('data', function (chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

gulp.task('clean', function() {
    gutil.log(gutil.colors.red('Cleaning Build Directories...'));
});

gulp.task('build', ['clean'], function() {
    gutil.log(gutil.colors.green('Building Distribution Code...'));
});

// default task gets development envrionment up and running.
gulp.task('default', [
    'sass',
    'develop',
    'watch'
]);
