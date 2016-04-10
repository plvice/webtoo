'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var closure = require('gulp-jsclosure');
var concat = require('gulp-concat');
var gulpCopy = require('gulp-copy');

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');

var path = {
    css: {
        source: './src/css/**/*.scss',
        dest: './dist/css'
    },
    js: {
        source: './src/js/**/*.js',
        dest: './dist/js'
    },
    images: {
        source: './src/img/**/*.*',
        baseHelper: './src/img',
        dest: './dist/img'
    },
    static: {
        source: './src/static/**/*.*',
        baseHelper: './src/static',
        dest: './dist/static'
    },
    templates: {
        source: './src/templates/*.hbs'
    }
}

var vendor = [
    './bower_components/handlebars/handlebars.min.js',
    './bower_components/handlebars/handlebars.runtime.min.js'
];

gulp.task('vendor', function() {
  return gulp.src(vendor)
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('templates', function(){
  gulp.src(path.templates.source)
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'core.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('compileJs', function() {
  return gulp.src(path.js.source)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    // .pipe(closure(['window', 'document']))
    .pipe(gulp.dest(path.js.dest));
});

gulp.task('sass', function () {
  return gulp.src(path.css.source)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.css.dest));
});

gulp.task('autoprefixer', function () {
  return gulp.src(path.css.dest + '/*.css')
    .pipe(plumber())
    .pipe(autoprefixer({
		    browsers: ['last 2 versions', '> 1%'],
		    cascade: false
     }))
     .pipe(gulp.dest(path.css.dest));
});

gulp.task('minify', function() {
  return gulp.src(path.css.dest + '/*.css')
        .pipe(plumber())
        .pipe(csso())
        .pipe(gulp.dest(path.css.dest));
});

gulp.task('compileCss', function (cb){
    return gulpSequence('sass', 'autoprefixer', 'minify', cb);
});

gulp.task('images', function(cb) {
    gulp.src(path.images.source, {base: path.images.baseHelper})
        .pipe(gulp.dest(path.images.dest));
});

gulp.task('static', function(cb) {
    gulp.src(path.static.source, {base: path.static.baseHelper})
        .pipe(gulp.dest(path.static.dest));
});

gulp.task('dist', function (cb) {
    console.log('running...');
    gulp.start('compileCss');
    gulp.start('compileJs');
    gulp.start('templates');
    gulp.start('vendor');
    gulp.start('images');
    gulp.start('static');
});

gulp.task('watch', function (cb) {
    watch(path.css.source, function() {
        gulp.start('compileCss');
    });
    watch(path.js.source, function() {
        gulp.start('compileJs');
    });
    watch(path.templates.source, function() {
        gulp.start('templates');
    });
    watch(path.images.source, function() {
        gulp.start('images');
    });
    watch(path.static.source, function() {
        gulp.start('static');
    });
});
