/* jshint node: true, strict: true */
'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  dest: 'www',
  cordova: true,
  less: {
    src: [
      './src/less/app.less',
      './src/less/responsive.less',
    ],
    paths: [
      './src/less/**/*.less',
      './bower_components/**/*.less',
    ]
  },
  scss: {
    src: [
      './src/scss/app.scss',
      './src/scss/responsive.scss',
    ],
    paths: [
      './src/scss/**/*.scss',
      './bower_components/**/*.scss',
    ]
  },
  css: {
    src: [
      './src/css/app.css',
      './src/css/responsive.css',
      './bower_components/framework7/dist/css/framework7.material.css',
      './bower_components/framework7/dist/css/framework7.material.colors.css',
    ],
    paths: [
      './src/css/**/*.css',
      //'./bower_components/**/*.css',
    ]
  },
  vendor: {
    js: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/angular/angular.js',
      './bower_components/angular-route/angular-route.js',
      //'./bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
      './bower_components/framework7/dist/js/framework7.js',
      './bower_components/bower-framework7-angularjs/framework7.angular.hook.js',
      './bower_components/angular-local-storage/dist/angular-local-storage.js'
    ],

    css: {
      prepend: [
        //'./bower_components/framework7/dist/css/framework7.ios.css'
      ],
      append: [
        './bower_components/framework7/dist/css/framework7.material.css',
        './bower_components/framework7/dist/css/framework7.material.colors.css'
      ],
    },

    images: [
      'src/images/**/*'
    ],

    fonts: [
      './bower_components/font-awesome/fonts/fontawesome-webfont.*'
    ],

    dists: [
      //'./bower_components/framework7/dist/**'
    ]
  },

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  weinre: {
    httpPort:     8001,
    boundHost:    'localhost',
    verbose:      false,
    debug:        false,
    readTimeout:  5,
    deathTimeout: 15
  }
};

if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp           = require('gulp'),
    seq            = require('run-sequence'),
    connect        = require('gulp-connect'),
    sass           = require('gulp-sass'),
    less           = require('gulp-less'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    cssmin         = require('gulp-cssmin'),
    minify         = require('gulp-minify-css'),
    order          = require('gulp-order'),
    concat         = require('gulp-concat'),
    ignore         = require('gulp-ignore'),
    rimraf         = require('gulp-rimraf'),
    templateCache  = require('gulp-angular-templatecache'),
    mobilizer      = require('gulp-mobilizer'),
    ngAnnotate     = require('gulp-ng-annotate'),
    replace        = require('gulp-replace'),
    ngFilesort     = require('gulp-angular-filesort'),
    streamqueue    = require('streamqueue'),
    rename         = require('gulp-rename'),
    path           = require('path'),
    merge          = require('merge-stream');


/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('error', function(e) {
  throw(e);
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function (cb) {
  return gulp.src([
        path.join(config.dest, 'index.html'),
        path.join(config.dest, 'images'),
        path.join(config.dest, 'css'),
        path.join(config.dest, 'js'),
        path.join(config.dest, 'fonts')
      ], { read: false })
     .pipe(rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
  if (typeof config.server === 'object') {
    connect.server({
      root: config.dest,
      host: config.server.host,
      port: config.server.port,
      livereload: true
    });
  } else {
    throw new Error('Connect is not configured');
  }
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function () {
  gulp.src(path.join(config.dest, '*.html'))
    .pipe(connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function () {
  return gulp.src(config.vendor.images)
        .pipe(gulp.dest(path.join(config.dest, 'images')));
});


/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
  return gulp.src(config.vendor.fonts)
  .pipe(gulp.dest(path.join(config.dest, 'fonts')));
});


/*==========================================
=            Copy distributions            =
==========================================*/

gulp.task('dists', function() {
  return gulp.src(config.vendor.dists)
  .pipe(gulp.dest(path.join(config.dest, 'dists')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
  var inject = [];
  if (typeof config.weinre === 'object') {
    inject.push('<script src="http://'+config.weinre.boundHost+':'+config.weinre.httpPort+'/target/target-script-min.js"></script>');
  }
  if (config.cordova) {
    inject.push('<script src="cordova.js"></script>');
  }
  gulp.src(['src/html/**/*.html'])
  .pipe(replace('<!-- inject:js -->', inject.join('\n    ')))
  .pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify, mobilize less                            =
======================================================================*/
/*
gulp.task('less', function () {

    return gulp.src(config.less.src).pipe(less({
      paths: config.less.paths.map(function(p){
        return path.resolve(__dirname, p);
      })
    }))
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(config.dest, 'css')));

});

gulp.task('css', function () {
    streamqueue({ objectMode: true },
      gulp.src(config.vendor.css.prepend),
      gulp.src(config.less.src).pipe(less({
        paths: config.less.paths.map(function(p){
          return path.resolve(__dirname, p);
        })
      })),
      gulp.src(config.vendor.css.append)
    )
    .pipe(concat('app.css'))
    .pipe(mobilizer('app.css', {
      'app.css': {
        hover: 'exclude',
        screens: ['0px']
      },
      'hover.css': {
        hover: 'only',
        screens: ['0px']
      }
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});
*/

gulp.task('styles', function() {

    var scssStream =
        streamqueue({ objectMode: true },
            gulp.src(config.scss.src),
            gulp.src(config.scss.paths)
        )
        .pipe(sass())
        .pipe(concat('scss-files.scss'))
    ;

    var lessStream = gulp.src(config.less.src)
        .pipe(less({
            paths: config.less.paths.map(function(p){
                return path.resolve(__dirname, p);
            })
        }))
        .pipe(less())
        .pipe(concat('less-files.less'))
    ;

    var cssStream =
        streamqueue({ objectMode: true },
            gulp.src(config.css.src),
            gulp.src(config.css.paths)
        )
        .pipe(concat('css-files.css'))
    ;

    var mergedStream = merge(lessStream, scssStream, cssStream)
        .pipe(concat('app.css'))
        .pipe(mobilizer('app.css', {
          'app.css': {
            hover: 'exclude',
            screens: ['0px']
          },
          'hover.css': {
            hover: 'only',
            screens: ['0px']
          }
        }))
        .pipe(cssmin())
        //.pipe(minify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.join(config.dest, 'css')));

    return mergedStream;
});

/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
    streamqueue({ objectMode: true },
      gulp.src(config.vendor.js),
      gulp.src('./src/js/**/*.js').pipe(ngFilesort()),
      gulp.src(['src/templates/**/*.html']).pipe(templateCache({ module: 'DrinkingGame' }))
    )
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function () {
  if (typeof config.server === 'object') {
    gulp.watch([config.dest + '/**/*'], ['livereload']);
  }
  gulp.watch(['./src/html/**/*'], ['html']);
  //gulp.watch(['./src/less/**/*'], ['less']);
  //gulp.watch(['./src/scss/**/*'], ['scss']);
  //gulp.watch(['./src/css/**/*'], ['css']);
  gulp.watch(['./src/less/**/*', './src/scss/**/*', './src/css/**/*'], ['styles']);
  gulp.watch(['./src/js/**/*', './src/templates/**/*', config.vendor.js], ['js']);
  gulp.watch(['./src/images/**/*'], ['images']);
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
  if (typeof config.weinre === 'object') {
    var weinre = require('./node_modules/weinre/lib/weinre');
    weinre.run(config.weinre);
  } else {
    throw new Error('Weinre is not configured');
  }
});


/*======================================
=            Build Sequence            =
======================================*/

gulp.task('build', function(done) {
  var tasks = ['html', 'fonts', /*'dists',*/ 'images', /*'less', 'sass', 'css',*/ 'styles', 'js'];
  seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done){
  var tasks = [];

  if (typeof config.weinre === 'object') {
    tasks.push('weinre');
  }

  if (typeof config.server === 'object') {
    tasks.push('connect');
  }

  tasks.push('watch');

  seq('build', tasks, done);
});
