const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const jsonTask = () => {
    gulp.src(JSON_FILES).pipe(gulp.dest('dist'));
}

const transpileTask = () => {
    jsonTask()
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
}


gulp.task('json', jsonTask);

gulp.task('transpile', transpileTask);

gulp.task('default', ['json', 'transpile']);