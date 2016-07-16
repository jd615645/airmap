var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gulpPlumber = require('gulp-plumber'),
    prefix = require('gulp-autoprefixer'),
    less = require('gulp-less');

gulp.task('less',function(){
  gulp.src('./public/style/less/*.less')
      .pipe(gulpPlumber())
      .pipe(less())
      .pipe(prefix())
      .pipe(gulp.dest('./public/style/css/'))
});

gulp.task('watch',function(){
  gulp.watch('./public/style/less/*.less',['less']);
});


gulp.task('default',['less','watch']);