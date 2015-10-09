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
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename");

// Compile SASS into CSS
gulp.task('sass', function () {
    gutil.log(gutil.colors.blue('Compiling SASS...'));
    return gulp.src('./src/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('js:frontend', function() {
    gutil.log(gutil.colors.blue('Minifying Frontend JS...'));
    return gulp.src('./src/js/**/*.js')
        .pipe(plumber())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'))
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

// Clean the build folders
gulp.task('clean', function() {
    gutil.log(gutil.colors.red('Cleaning Build Directories...'));
    return del([
        '/public/css/*.css',
        '/public/js/*.js'
    ]);
});

gulp.task('build', ['sass', 'js:frontend'], function() {
    gutil.log(gutil.colors.green('Built Distribution Code...'));
});

gulp.task('build-dev', [], function() {
    gutil.log(gutil.colors.yellow('Built Development Code...'));
});

// Watch the frontend, rebuild when needed, tell livereload
gulp.task('watch', function () {
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/js/**/*.js', ['js:frontend']);
});

// default task gets development envrionment up and running.
gulp.task('default', [
    'build',
    'develop',
    'watch'
]);
