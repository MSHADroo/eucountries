var gulp = require('gulp');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
const rename= require('gulp-rename');
const inject = require('gulp-inject');
const replace = require('gulp-replace');
const zip = require('gulp-zip');

const iso="be,bg,cz,dk,de,ee,ie,gr,es,fr,hr,it,cy,lv,lt,lu,hu,mt,nl,at,pl,pt,ro,si,sk,fi,se,gb,eu"; 
//gb, not uk. ee, not gr

gulp.task('init', function(){
  return gulp.src(["node_modules/d3/dist/d3.min.js"])
  .pipe(gulp.dest("./dist/js"));
});

gulp.task('copy', function () {
  var files=[];
  iso.split(",").map((c)=>{ files.push("node_modules/flag-icon-css/flags/4x3/"+c+".svg")});
  return gulp.src(files)
  .pipe(gulp.dest('./svg/country'));
});


gulp.task('html', function() {
  return gulp.src('src/index.html')
  .pipe(inject(gulp.src(['svg/eu-flags.svg']),
   {starttag: '<!-- inject:{{path}} -->',
    relative: true,
    transform: function (filePath, file) {
      console.log(filePath);
      return file.contents.toString('utf8')}
   }))
  .pipe(gulp.dest('.'));
});

gulp.task('svg', function () {

  var files=[];
  iso.split(",").map((c)=>{ files.push("svg/country/"+c+".svg")});
    return gulp
        .src(files)
        .pipe(rename({prefix: 'flag-'}))
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [
                  {
                removeDoctype: true
            }, {
                removeComments: true
            }, {
                cleanupNumericValues: {
                    floatPrecision: 1
                }},
            {
              convertPathData: {
                floatPrecision: 2
              }
            },
            {
              transformsWithOnePath: {
                floatPrecision: 2
              }
            },
            {
              convertTransform: {
                floatPrecision: 2
              }
            },
            {
              cleanupListOfValues: {
                floatPrecision: 2
              }
            },{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(replace('<symbol ','<symbol viewBox="0 0 640 480" '))
        .pipe(replace('</svg>','<symbol id="flag-uk"><use href="#flag-gb" /></symbol><symbol id="flag-el"><use href="#flag-gr" /></symbol></svg>'))
        .pipe(rename("eu-flags.svg"))
        .pipe(gulp.dest('svg'))
        .pipe(zip(("eu-flags.svg.zip")))
        .pipe(gulp.dest('svg'))
});

gulp.task('default', ['init','copy','svg','html']);

