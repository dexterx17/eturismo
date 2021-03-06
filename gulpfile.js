var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'), //une varios archjivos en uno
    newer = require('gulp-newer'), //para filtrar solo archivos que tuvieron cambios
    del = require('del'), //para borrar archivos
    deporder = require('gulp-deporder'), //ordena los scripts
    browsersync = require('browser-sync'),
    size = require('gulp-size'); //obtiene el tamaño de los archivos o carpetas

var
    devBuild = true, // TRUE for development, FALSE for production
    source = "",
    dest = "",
    css = { in: source + 'node_modules/bootstrap/scss/bootstrap.scss',
        out: "css/",
        watch: [
            source + 'scss/**/*'
        ],
    },
    js = { in: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/popper.js/dist/umd/popper.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/axios/dist/axios.min.js',
            'node_modules/vue/dist/vue.js',
            'app.js'
        ],
        out: dest + 'js/',
        filename: 'main.js'
    },
    syncOpts = {
        server: {
            baseDir: dest,
            index: 'index.html'
        },
        open: false,
        notyfy: true
    };;

//compila los estilos css y les a;ade los prefijos necesarios para compatibilidad
gulp.task('sass', function() {
    return gulp.src(css.in)
        .pipe(size({ title: 'CSS in' }))
        .pipe(sass(css.sassOpts))
        .pipe(size({ title: 'CSS out' }))
        .pipe(gulp.dest(css.out));
});

//combina los javasript en uno
gulp.task('js', function() {
    if (devBuild) {
        return gulp.src(js.in)
            .pipe(size({ title: 'JS in' }))
            .pipe(newer(js.out))
            .pipe(size({ title: 'JS out' }))
            .pipe(gulp.dest(js.out));
    } else {
        del([
            dest + 'js/*'
        ]);
        return gulp.src(js.in)
            .pipe(deporder())
            .pipe(size({ title: 'JS in' }))
            .pipe(concat(js.filename))
            .pipe(size({ title: 'JS out' }))
            .pipe(gulp.dest(js.out));

    }
});

gulp.task('browsersync', function() {
    browsersync(syncOpts);
});

gulp.watch(css.watch, gulp.series(['sass']));
gulp.watch(js.in, gulp.series(['js']));

gulp.task('default', gulp.series(['sass', 'js']));