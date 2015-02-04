var gulp = require('gulp');
var del = require('del');
var spritesmith = require('gulp.spritesmith');

gulp.task('clean', function(cb) {
  del(['dist/*.*'], cb);
});

gulp.task('sprite', ['clean'],function () {
  var spriteData = gulp.src('./app/front_images/index/xz-btn/*.png').pipe(spritesmith({
    imgName: 'xz.png',
    cssName: 'xz.css'
  }));
  spriteData.pipe(gulp.dest('dist'));
});

gulp.task('default', ['sprite']);