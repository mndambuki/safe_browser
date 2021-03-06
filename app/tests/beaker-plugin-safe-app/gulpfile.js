var gulp = require('gulp'),
  glob = require('glob'),
  concat = require('gulp-concat'),
  nodemon = require('gulp-nodemon'),
  watch = require('gulp-watch'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  babelify = require('babelify');

gulp.task('js-deps', function () {
  gulp.src([
      '../../node_modules/mocha/mocha.js'
    ])
    .pipe(gulp.dest('./test_assets/js'));
});

gulp.task('html', function () {
  gulp.src(
    './index.html'
    )
    .pipe(gulp.dest('./test_assets'));
});

gulp.task('css-deps', function () {
  gulp.src([
      '../../node_modules/mocha/mocha.css',
    ])
    .pipe(concat('deps.css'))
    .pipe(gulp.dest('./test_assets/css'));
});

gulp.task('js', function () {
  var sourceDirectory = __dirname + '/test_modules',
    destinationDirectory = __dirname + '/test_assets/js',
    outputFile = 'test-modules.js';

    glob(sourceDirectory + '/**/*.spec.js', function(err, files) {
      var bundler = browserify(files).transform(babelify);

      return bundler.bundle()
        .on('error', function(err) {
          console.log(err);
        })
        .pipe(source('test-modules.js'))
        .pipe(gulp.dest(destinationDirectory));
    });

});

gulp.task('serve', function () {
  nodemon({
    script: './index.js',
    ext: 'html js',
    ignore: ['test_assets/**/*.*'],
    tasks: []
  }).on('restart', function () {
    console.log('server restarted....');
  });
});

gulp.task('watch', function () {
  watch(['./test_modules/**/*.js'], function () {
    gulp.start('js');
  });

  watch('./index.html', function () {
    gulp.start('html');
  });
});

gulp.task('default', ['js-deps', 'html', 'css-deps', 'js', 'watch', 'serve']);
