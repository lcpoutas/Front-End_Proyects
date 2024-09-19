const { src, dest, watch, series, paralell } = require("gulp"); //importamos las funciones que necesitamos de gulp
const sass = require("gulp-sass")(require("sass")); //importamos las funciones gulp-sass y sass en la variable sass
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

//imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// si hay llaves despues de declarar const quiere decir que se estan exportando multiples funciones si no las hay solo se exporta 1 funcion
// src es una funcion de gulp que nos permite identificar archivos
// los .pipe sirven para que al terminar una tarea se ejecute la siguuiente a continucaión, lo que se ejecuta es lo que pondrá entre los ()
// Series -  ejecuta las tareas en serie
// Paralell - se ejecutan las tareas en paralelo

//descargar las dependencias autoprefixer y gulp-postcss que nos permitiran escribir codigo de ultima generacion de css -> gulp --save-dev autoprefixer gulp-postcss

function css(done) {
  //compilar sass
  //paso 1: identificar archivo -> funcion src
  //paso 2: compilar la tarea -> .pipe(sass())
  //paso 3: guardar el .css -> pipe(dest())

  src("src/sass/app.scss")
    //invocamos las funciones guardadas en la variable sass
    .pipe(sourcemaps.init()) //iniciamos sourcemaps
    .pipe(sass({ outputStyle: "expanded" })) // con esta función (outputStyle: "expanded") podemos comprimir o expandir el codigo css de nuestro archivo y así modular su peso
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(".")) //guarda el sourcemaps en build
    .pipe(dest("build/css"));
  done();
}

//cuando estoy escribiendo codigo css y quiero que esté tomando los cambios se denomina watch, gulp tiene una api para esto
// watch toma 2 valores: 1- a que tiene que prestar atencion, 2- que hago cuando haya cambios en lo que se fija, en nuestro caso, vuelve a llamar a la funcion css

function dev() {
  watch("src/sass/**/*.scss", css); // el /**/ le dice que dentro de la carpeta en cuestion buesque cualquier ubicacion donde haya archivos con la estension designada
  //mediante /*.extension; en este caso .scss
  watch("src/img/**/*", imagenes);
}

function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

function versionWebp() {
  return src("src/img/**/*.{png, jpg}") //cogemos todas las imagenes que tengan extensiones .png y .jpg
    .pipe(webp())
    .pipe(dest("build/img"));
}

function versionAvif() {
  const opciones = {
    //esto tambien se puede incluir en webp
    quality: 50,
  };
  return src("src/img/**/*.{png, jpg}") //cogemos todas las imagenes que tengan extensiones .png y .jpg
    .pipe(avif(opciones))
    .pipe(dest("build/img"));
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);
