/* Set requirements */
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    del = require('del');
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util');

// Set paths
var scriptFiles = 'js/**/*.js',
    scriptDest = 'dist/js',
    styleFiles = 'scss/**/*.scss',
    styleDest = 'dist/css',
    imgFiles = 'images/**/*.*',
    imgDest = 'dist/img';
    fontFiles = 'fonts/**/*.*',
    fontDest = 'dist/fonts';

/* helper functions */
// handling errors
var onError = function (err) {  
  gutil.log;
  console.log(err);
};

/* Define tasks */

// Cleanup dist folders
gulp.task('clean', function() {
  del.sync([
      styleDest,
      fontDest,
      imgDest,
      scriptDest
    ]);
})

// Copy fonts to dist
gulp.task('fonts', function() {
    return gulp.src('node_modules/npm-font-open-sans/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/open-sans/'))
})

// Copy icons to dist
gulp.task('icons', function() {
    return gulp.src('node_modules/font-awesome/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/font-awesome/'))
})

// Copy scripts to dist
gulp.task('scripts', function() {
    return gulp.src([
        scriptFiles,
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/chart.js/dist/Chart.min.js',
        'node_modules/jquery-validation/dist/jquery.validate.min.js'
    ]).pipe(gulp.dest(scriptDest))
})

// Copy images to dist
gulp.task('images', function() {
    return gulp.src(imgFiles)
    .pipe(gulp.dest(imgDest))
})

// Compile scss to minifyed css
gulp.task('scss', function(){
  gulp.src('scss/*.scss')
    .pipe(plumber({ // More graceful error handling, prevents watch from breaking.
      errorHandler: onError
    }))
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest(styleDest)) // Destination for css
    .pipe(gulpIf('*.css', cssnano())) // minifi the css file
    .pipe(browserSync.reload({ // Reload browser with changes
      stream: true
  }))
});

// Watch task for easy development
gulp.task('watch', [`default`], function(){
  gulp.watch('scss/**/*.scss', ['scss']);
})

// Reload browser with watch task
gulp.task('browserSync', function() {
  browserSync.init({
    files: styleDest
  })
})

// Default task when running gulp
gulp.task('default', function (callback) {
  runSequence(['clean', 'fonts', 'icons', 'scripts', 'images', 'scss'],
    callback
  )
})

