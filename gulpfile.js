var gulp = require('gulp');

var sass     = require('gulp-sass'),
    concat   = require('gulp-concat'),
    uglify   = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename   = require('gulp-rename');

gulp.task('sass', function() {
    return gulp.src('assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('js', function() {
    return gulp.src('assets/js/src/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('assets/js/build'))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('assets/js/build'));
});

gulp.task('default', ['sass', 'js']);
