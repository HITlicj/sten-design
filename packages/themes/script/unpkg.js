const process = require('process');
const gulp = require('gulp');
const less = require('gulp-less');
const gulpIf = require('gulp-if');
const rename = require('gulp-rename');
const LessAutoprefix = require('less-plugin-autoprefix');
const NpmImportPlugin = require('less-plugin-npm-import');
const cleanCSS = require('gulp-clean-css');
const {print} = require('arco-cli-dev-utils');
const chokidar = require('chokidar');
const npmImport = new NpmImportPlugin({ prefix: '~' });
const autoprefix = new LessAutoprefix();

const {
    BUILD_ENV_MODE,
} = process.env;

const compilerOptions = {
    paths: ['node_modules'],
    plugins: [npmImport, autoprefix],
    relativeUrls: true,
    javascriptEnabled: true,
};
// Output less compilation errors, and avoid the program from exiting due to errors
const notifyLessCompileResult = (stream) => {
  let hasError = false;
  return stream
    .on('error', function (error) {
      hasError = true;
      print.error('[arco-scripts]', 'Failed to update style');
      console.error(error);
      this.emit('end');
    })
    .on('end', () => {
      !hasError && print.info('[arco-scripts]', `Style updated at ${new Date().toLocaleString()}`);
    });
};
// Compile the packaged less into css
function compileLessToCss() {
    const rawFilePath = 'src/index.less';
    const cssFileName = 'index.css';
    const distPath = 'dist';
    const needCleanCss = !BUILD_ENV_MODE || BUILD_ENV_MODE === 'production';

    let stream = gulp.src(rawFilePath, { allowEmpty: true });
    stream = stream.pipe(less(compilerOptions));

    // Errors should be thrown, otherwise it will cause the program to exit
    if (BUILD_ENV_MODE === 'development') {
        notifyLessCompileResult(stream);
    }

    return stream
        .pipe(gulpIf(needCleanCss, cleanCSS()))
        .pipe(rename(cssFileName))
        .pipe(gulp.dest(distPath))
        .on('error', (error) => {
            print.error('[arco-scripts]', 'Failed to build css, error in dist all css');
            console.error(error);
        });
}
function run() {
    const cwd = process.cwd;
    // First build
    compileLessToCss();
    if (BUILD_ENV_MODE === 'development') {
        const watcher = chokidar.watch('src/**', {
            ignoreInitial: true,
        });

        watcher.on('all', (event, fullPath) => {
            const relPath = fullPath.replace(cwd, '');
            print.info(`[${event}] ${relPath}`);
            try {
                compileLessToCss();
            } catch {}
        });
    }
}
run();

