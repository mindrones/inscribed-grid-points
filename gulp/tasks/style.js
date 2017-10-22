import gulp from 'gulp';
import gutil from 'gulp-util';
import less from 'gulp-less';
import browserSync from 'browser-sync';

gulp.task('style', () => {
    return gulp.src('./src/index.less')
        .pipe(less().on('error', gutil.log))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});
