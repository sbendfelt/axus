var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('babelify', function() {
  return gulp.src(['lib/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('target'));
});

gulp.task('watch:lib', function() {
  gulp.watch('lib/**/*.js', ['babelify']);
});

gulp.task('default', ['babelify']);
