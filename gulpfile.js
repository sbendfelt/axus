var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('babelify', gulp.series(function(done) {
  return gulp.src(['lib/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('target'));
    done();
}));

gulp.task('watch:lib', gulp.series(function(done) {
  gulp.watch('lib/**/*.js', gulp.series('babelify'));
  done();
}));

gulp.task('default', gulp.series('babelify'));
