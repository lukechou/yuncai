'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var spritesmith = require('gulp.spritesmith');
var uglify = require('gulp-uglify');
var paths = {
  scripts:['app/front_scripts/*.js','app/front_scripts/**/*.js'],
  styles:['app/front_styles/*.css','app/front_styles/**/*.css'],
  fonts:['app/front_styles/fonts/**/*']
};


gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe($.sourcemaps.init())
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src(paths.scripts)
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat(paths.fonts))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});


gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['html', 'images', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});








// Css Sprite
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

  var spriteKlpk = gulp.src('./app/front_images/klpk/group/*.png').pipe(spritesmith({
    imgName: 'front_images/klpk/klpk-group.png',
    cssName: 'front_styles/klpk-icon.css'
  }));

  spriteData.pipe(gulp.dest('dist'));
  spriteDataIcon.pipe(gulp.dest('dist'));
  spriteDataLrkf.pipe(gulp.dest('dist'));
  spriteJczqBf.pipe(gulp.dest('dist'));
  spriteFootGray.pipe(gulp.dest('dist'));
  soriteFootBlack.pipe(gulp.dest('dist'));
  spriteHomeLogo.pipe(gulp.dest('dist'));
  spriteKlpk.pipe(gulp.dest('dist'));

});



