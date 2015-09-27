var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    env = require('gulp-env'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util');

gulp.task('sass', function () {
    gulp.src('./public/css/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('watch', function () {
    gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {

    gutil.log(gutil.colors.green('Running App...'));

    env({
        file: 'env.json'
    });

    livereload.listen();

    nodemon({
        script: 'bin/www',
        ext: 'js jade coffee',
        stdout: false
    }).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

gulp.task('default', [
    'sass',
    'develop',
    'watch'
]);
