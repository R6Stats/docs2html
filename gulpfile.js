(function () {

    'use strict';

    var gulp    = require('gulp'),
    merge   = require('merge-stream'),
    args    = require('yargs').argv,
    gulpif  = require('gulp-if'),
    concat  = require('gulp-concat'),
    sass    = require('gulp-sass'),
    minify  = require('gulp-minify'),
    htmlmin = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    jshint  = require('gulp-jshint'),
    del     = require('del'),
    karma   = require('karma').server,
    exists  = require('path-exists'),
    pug     = require('gulp-pug'),
    md = require('markdown-it')(),
    swagger = require('./swagger');

    var locals;
    swagger.getSections(function(data) {
        locals = {sections: data};
    });
    // pug.filters.md = md;

    var watchFiles = [
        // Templates
        'src/**/*.pug',

        // Styles
        'assets/**/*.scss',
        'app/**/*.scss',

        // Asset files
        'assets/fonts/**/*',
        'assets/images/**/*',
        'assets/mock-data/**/*',

        // Core files
        '.htaccess',
        'index.html'

        ];

    // Watch tasks
    gulp.task('runUnitTests', runUnitTests);
    gulp.task('cleanBuildFolder', cleanBuildFolder);
    gulp.task('buildCSS', convertSASStoCSS);
    gulp.task('buildJS', gulp.series(lintJS, concatJSFiles));
    gulp.task('minification', minification);
    gulp.task('moveAppFiles', moveAppFiles);
    gulp.task('cleanTempFolder', cleanTempFolder);
    gulp.task('compileViews', compileViews);
    gulp.task('watch', watch);

    // Build task
    gulp.task('build', gulp.series(
        'cleanBuildFolder',
        'buildCSS',
        'buildJS',
        'minification',
        'moveAppFiles',
        'cleanTempFolder',
        'compileViews'
        ));

    // Default tasks to run when gulp is first initiated
    gulp.task('default', gulp.series(
        'build',
        'watch'
        ));

    function runUnitTests () {
        karma.start({
            configFile: __dirname + '/karma.conf.js'
        });
    }

    function compileViews() {

        return gulp.src('src/**/*.pug')
        .pipe(pug({
            locals: {sections: locals, md: md},
        }))
        .pipe(gulp.dest('build/'));

    }

    function cleanBuildFolder () {
        return exists('build') ? del('build') : true;
    }

    function convertSASStoCSS () {
        return gulp.src('assets/sass/default.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('temp/'));
    }

    function lintJS () {
        return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
    }

    function concatJSFiles () {
        return gulp.src([
            'assets/js/**/*.js'
            ]).pipe(concat('r6stats.js'))
        .pipe(gulp.dest('temp/'));
    }

    function minification () {
        var js = gulp.src('temp/r6stats.js')
        .pipe(gulpif(args.minify, minify({
           ext: { src:'.js', min:'.min.js' }
       })))
        .pipe(gulp.dest('build/js/'));
        var css = gulp.src('temp/default.css')
        .pipe(gulpif(args.minify, cssnano()))
        .pipe(gulp.dest('build/css/'));
        return merge(js, css);
    }

    function moveAppFiles () {
        var htaccess = gulp.src('.htaccess').pipe(gulp.dest('build/')),
        // mainView = gulp.src('index.html').pipe(gulp.dest('build/')),
        fonts    = gulp.src('assets/fonts/**/*').pipe(gulp.dest('build/fonts/')),
        images   = gulp.src('assets/images/**/*').pipe(gulp.dest('build/img/')),
        mock     = gulp.src('assets/mock-data/**/*').pipe(gulp.dest('build/mock/'));
        return merge(htaccess, fonts, images, mock);
    }

    function cleanTempFolder () {
        return exists('temp') ? del('temp') : true;
    }

    function watch () {
        gulp.watch(watchFiles, gulp.series('build'));
    }

})();
