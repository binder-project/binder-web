var gulp = require('gulp')
var watch = require('gulp-watch')
var browserify = require('gulp-browserify')
var sourcemaps = require('gulp-sourcemaps')

var paths = {
  scripts: ['site/*']
}

function build () {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(gulp.dest('./public/'))
}

gulp.task('build', build)

gulp.task('watch', function () {
  watch(paths.scripts, build)
})
