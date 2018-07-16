const gulp = require('gulp')
const path = require('path')
const download = require("gulp-download")
const decompress = require('gulp-decompress')
const del = require('del')
const install = require("gulp-install")
const child_process = require('child_process')
const exec = require('gulp-exec');
const fs = require('fs')

// build
const pathx = path.join(__dirname, 'xtensa-esp32-elf')
const pathy = path.join(pathx, '*.{tar,tar.bz2,tar.gz,zip}')
const patha = path.join(__dirname, 'app', 'package.json')
const pathc = path.join(__dirname, 'package.json')
const pathk = path.join(__dirname, 'archive', 'kidbright32.json')
const pathcz = path.join(__dirname, '*.{tar,tar.bz2,tar.gz,zip}')
var pathl, pathe

// clean
const pathcx = path.join(__dirname, 'xtensa-esp32-elf')
const pathca = path.join(__dirname, 'app', 'node_modules')
const pathcc = path.join(__dirname, 'node_modules')

gulp.task('download_xtensa', () => {
    var json = JSON.parse(fs.readFileSync(pathk))
    for (var i = 0; i < json.packages.length; i++) {
        if (process.platform == json.packages[i].platform) {
            pathl = json.packages[i].items[0].download_url
            pathe = json.packages[i].items[1].download_url
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

gulp.task('download_esptool', ['download_xtensa'], () => {
    return download(pathe)
        .pipe(gulp.dest(__dirname))
})

gulp.task('decompress_esptool', ['download_esptool'], () => {
    return gulp.src(pathcz)
        .pipe(decompress({ strip: 1 }))
        .pipe(gulp.dest(__dirname))
})

gulp.task('chmod_linux', ['decompress_esptool'], () => {
    if (process.platform == 'linux') {
        return gulp.src(__dirname)
            .pipe(exec('chmod 755 espytool.py'))
    } 
    else {
        return
    }
})

gulp.task('decompress_xtensa', ['chmod_linux'], () => {
    if (fs.existsSync(pathl)) {
        return
    }
    else {
        return gulp.src(pathy)
            .pipe(decompress({ strip: 1 }))
            .pipe(gulp.dest(pathx))
    }
})

gulp.task('del', ['decompress_xtensa'], () => {
    return del([pathy, pathcz])
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