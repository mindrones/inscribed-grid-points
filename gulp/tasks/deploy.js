import gulp from 'gulp';
import runSequence from 'run-sequence'
import ghPages from 'gulp-gh-pages'
import options from '../options'

gulp.task('commitToGhPages', () => {
    let opts = {cacheDir: '.ghpcache'};
    if (options.m) {
        opts.message = options.m
    }

    return gulp.src('./dist/**/*')
        .pipe( ghPages(opts) );
})

gulp.task('deploy', () => {
    runSequence(
        'build',
        'commitToGhPages'
    )
})
