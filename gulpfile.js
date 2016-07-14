var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gulpPlumber = require('gulp-plumber'),
    less = require('gulp-less');

gulp.task('less',function(){
  gulp.src('./public/style/less/*.less')
      .pipe(gulpPlumber())
      .pipe(less())
      .pipe(gulp.dest('./public/style/css/'))
});

gulp.task('watch',function(){
  gulp.watch('./style/less/*.less',['less']);
});

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    ext: 'js',
    ignore: ['./public/**'],
    nodeArgs: ['--debug']
  }).on('start', function() {
    if (!called) {
      called = true;
      cb();
    }
  });
});

gulp.task('default',['less','watch']);