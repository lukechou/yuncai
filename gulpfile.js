var gulp = require('gulp');
var del = require('del');
var spritesmith = require('gulp.spritesmith');

gulp.task('clean', function (cb) {
  del(['dist/*.*'], cb);
});

gulp.task('sprite', ['clean'], function () {

  var spriteData = gulp.src('./app/front_images/index/xz-btn/*.png').pipe(spritesmith({
    imgName: 'front_images/xz.png',
    cssName: 'front_styles/xz.css'
  }));

  var spriteDataLrkf = gulp.src('./app/front_images/lrkf/*.png').pipe(spritesmith({
    imgName: 'front_images/lrkf.png',
    cssName: 'front_styles/lrkf.css'
  }));

  var spriteDataIcon = gulp.src('./app/front_images/icon/*.png').pipe(spritesmith({
    imgName: 'front_images/icon.png',
    cssName: 'front_styles/icon.css'
  }));

  var spriteJczqBf = gulp.src('./app/front_images/jczq/bf/*.png').pipe(spritesmith({
    imgName: 'front_images/jczq/bf.png',
    cssName: 'front_styles/bf.css'
  }));

  var spriteFootGray = gulp.src('./app/front_images/foot2/*.png').pipe(spritesmith({
    imgName: 'front_images/foot-gray.png',
    cssName: 'front_styles/foot-gray.css'
  }));

  var soriteFootBlack = gulp.src('./app/front_images/foot1/*.png').pipe(spritesmith({
    imgName: 'front_images/foot-black.png',
    cssName: 'front_styles/foot-black.css'
  }));

  var spriteHomeLogo = gulp.src('./app/front_images/lottery/home_logo/*.png').pipe(spritesmith({
    imgName: 'front_images/home-logo.png',
    cssName: 'front_styles/home-logo.css'
  }));


  spriteData.pipe(gulp.dest('dist'));
  spriteDataIcon.pipe(gulp.dest('dist'));
  spriteDataLrkf.pipe(gulp.dest('dist'));
  spriteJczqBf.pipe(gulp.dest('dist'));
  spriteFootGray.pipe(gulp.dest('dist'));
  soriteFootBlack.pipe(gulp.dest('dist'));
  spriteHomeLogo.pipe(gulp.dest('dist'));

});

gulp.task('default', ['sprite']);