const gulp = require('gulp')
const path = require('path')
const download = require("gulp-download")
const decompress = require('gulp-decompress')
const del = require('del')
const install = require("gulp-install")
const child_process = require('child_process')
const fs = require('fs')

// build
const pathx = path.join(__dirname, 'xtensa-esp32-elf')
const pathy = path.join(pathx, '*.{tar,tar.bz2,tar.gz,zip}')
const patha = path.join(__dirname, 'app', 'package.json')
const pathc = path.join(__dirname, 'package.json')
const pathk = path.join(__dirname, 'archive', 'kidbright32.json')
var pathl

// clean
const pathcx = path.join(__dirname, 'xtensa-esp32-elf')
const pathca = path.join(__dirname, 'app', 'node_modules')
const pathcc = path.join(__dirname, 'node_modules')

gulp.task('download', () => {
    var json = JSON.parse(fs.readFileSync(pathk))
    for (var i = 0; i < json.packages.length; i++) {
        if (process.platform == json.packages[i].platform) {
            pathl = json.packages[i].items[0].download_url
            break
        }
    }
    if (fs.existsSync(pathx)) {
        return
    }
    else {
        return download(pathl)
            .pipe(gulp.dest(pathx))
    }
})

gulp.task('decompress', ['download'], () => {
    if (fs.existsSync(pathl)) {
        return
    }
    else {
        return gulp.src(pathy)
            .pipe(decompress({ strip: 1 }))
            .pipe(gulp.dest(pathx))
    }
})

gulp.task('del', ['decompress'], () => {
    return del([pathy])
})

gulp.task('install', ['del'], () => {
    return gulp.src([patha, pathc])
        .pipe(install());
})

gulp.task('build', ['install'], () => {
    return child_process.execSync('node index.js')
})

gulp.task('clean', () => {
    return del([pathcx, pathca, pathcc])
})