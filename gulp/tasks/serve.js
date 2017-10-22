import { default as gulp } from 'gulp'
import { default as browserSync } from 'browser-sync'
import { default as runSequence } from 'run-sequence'

gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: './dist',
        },
        port: 8001,
        open: false,
        reloadOnRestart: true,
        notify: false,
        ghostMode: false
    })

    gulp.watch('./src/**/*.less', ['style']);
    gulp.watch(['src/**/*.js', 'src/*.js'], () => {
        runSequence(
            'logic',
            browserSync.reload
        );
    });

    gulp.watch('./src/index.html', () => {
        runSequence(
            'html',
            browserSync.reload
        );
    });

    // gulp.watch('./src/**/*.less', ['style'])
})
