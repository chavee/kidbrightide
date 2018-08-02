const gulp = require('gulp')
const path = require('path')
const download = require("gulp-download")
const del = require('del')
const install = require("gulp-install")
const exec = require('gulp-exec');
const fs = require('fs')

// build
const pathx = path.join(__dirname, 'xtensa-esp32-elf')
const patha = path.join(__dirname, 'app', 'package.json')
const pathc = path.join(__dirname, 'package.json')
const pathk = path.join(__dirname, 'archive', 'kidbright32.json')
const pathz = path.join(__dirname, '*.{tar,tar.bz2,tar.gz,zip}')
var pathl, pathe
var pathnl, pathne, pathnlt, pathnet

// clean
const pathcx = path.join(__dirname, 'xtensa-esp32-elf')
const pathca = path.join(__dirname, 'app', 'node_modules')
const pathcc = path.join(__dirname, 'node_modules')

gulp.task('install', () => {
    del([pathz])
    return gulp.src(__dirname)
        .pipe(exec("npm install --prefix " + __dirname))
        .pipe(exec("npm install --prefix ./app"))
})

gulp.task('download_xtensa', ['install'], () => {
    var json = JSON.parse(fs.readFileSync(pathk))
    for (var i = 0; i < json.packages.length; i++) {
        if (process.platform == json.packages[i].platform) {
            pathl = json.packages[i].items[0].download_url
            pathnl = pathl.split("dl/")[1]
            pathnlt = pathnl.split('.gz')[0]
            console.log(pathnlt);
            pathe = json.packages[i].items[1].download_url
            if (process.platform == 'win32' || process.platform == 'darwin') {
                pathne = pathe.split("dl/")[1]
                pathnet = pathne.split('.gz')[0]
            }
            break
        }
    }
    if (fs.existsSync(pathx) || fs.existsSync(pathnlt) || fs.existsSync(pathnl)) {
        return
    }
    else {
        return download(pathl)
            .pipe(gulp.dest(__dirname))
    }
})

gulp.task('download_esptool', ['download_xtensa'], () => {
    if (process.platform == 'darwin') {
        if (!fs.existsSync(pathnet) || !fs.existsSync(pathne)) {
            return download(pathe)
                .pipe(gulp.dest(__dirname))
        }
        return
    } else if (process.platform == 'win32') {
        if (!fs.existsSync(pathne)) {
            return download(pathe)
                .pipe(gulp.dest(__dirname))
        }
        return
    } else {
        return download(pathe)
            .pipe(gulp.dest(__dirname))
    }
})

gulp.task('decompress', ['download_esptool'], () => {
    if (fs.existsSync(pathx)) {
        if (process.platform == 'darwin') {
            return gulp.src(__dirname)
                .pipe(exec('tar xvzf ' + pathne))
        } else if (process.platform == 'win32') {
            return gulp.src(__dirname)
                .pipe(exec("powershell.exe -NoP -NonI -Command " + "Expand-Archive '" + pathne + "' '.'"))
        }
        return
    } else {
        if (process.platform == 'darwin') {
            return gulp.src(__dirname)
                .pipe(exec('tar xvzf ' + pathnl))
                .pipe(exec('tar xvzf ' + pathne))
        } else if (process.platform == 'linux') {
            return gulp.src(__dirname)
                .pipe(exec('tar xvzf ' + pathnl))
        } else if (process.platform == 'win32') {
            return gulp.src(__dirname)
                .pipe(exec("powershell.exe -NoP -NonI -Command " + "Expand-Archive '" + pathnl + "' '.'"))
                .pipe(exec("powershell.exe -NoP -NonI -Command " + "Expand-Archive '" + pathne + "' '.'"))
        }
    }
})

gulp.task('chmod_linux', ['decompress'], () => {
    if (process.platform == 'linux') {
        return gulp.src(__dirname)
            .pipe(exec('chmod 755 esptool.py'))
    }
    else {
        return
    }
})

gulp.task('del', ['chmod_linux'], () => {
    return del([pathz])
})

gulp.task('build', ['del'], () => {
    return
})

gulp.task('clean', () => {
    return del([pathcx, pathca, pathcc])
})
