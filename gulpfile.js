var gulp=require('gulp');
var watch=require('gulp-watch');
var connect=require('gulp-connect');

gulp.task('watch',function(){
    gulp.watch('src/**/**.**',['update']);
    gulp.watch('index.html',['index']);
});
gulp.task('update',function(){
    gulp.src('src/**/**.**')
    .pipe(connect.reload());
});
gulp.task('index',function(){
    gulp.src('index.html')
    .pipe(connect.reload());
});
gulp.task('connect',function(){
    connect.server({
        root:'',
        livereload:true
    });
});
gulp.task('default',['connect','watch']);