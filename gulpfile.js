var gulp = require('gulp'),
    mainBowerFiles = require('main-bower-files'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch');
/**
 * Do default tasks
 */
gulp.task('default', ['sass', 'bower-files'], function() {
    console.log('Ran all the task');
});
/**
 * Compile scss files using by Sass-preprocessor
 **/
gulp.task('sass', function() {
    gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./site/css/'));
});
/**
 * start watching mode. In case changing any scss file it launch the compile process
 */
gulp.task('watch', function() {
    watch('./sass/*.scss', {interval: 1000}, function() {
        gulp.start('sass');
    });
});
/**
 * Add the jQuery and Angular packages
 **/
gulp.task('bower-files', function() {
    gulp.src(mainBowerFiles({
        overrides: {
            jquery: {
                main: 'dist/jquery.min.js'
            }
        }
    })).pipe(gulp.dest('./site/lib'));
});
/**
 * Clean all the automatic installed files
 */
gulp.task('clean', function() {
    gulp.src(['./site/+(lib|css)/*.+(js|css)']).pipe(clean());
});
