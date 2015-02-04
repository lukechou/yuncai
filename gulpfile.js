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

  var spriteDataIcon = gulp.src('./app/front_images/icon/*.png').pipe(spritesmith({
    imgName: 'icon.png',
    cssName: 'icon.css'
  }));

  spriteData.pipe(gulp.dest('dist'));
  spriteDataIcon.pipe(gulp.dest('dist'));
});

gulp.task('default', ['sprite']);