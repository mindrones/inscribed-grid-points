import { default as gulp } from 'gulp'
// import { default as gutil } from 'gulp-util'

gulp.task('html', () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('./dist'))
});
