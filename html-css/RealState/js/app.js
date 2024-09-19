const imagenes = document.querySelectorAll(".propiedad__imagen"); //selecionamos todas la imagenes que tengan la clase propiedad__imagen

addEventListener("scroll", () => {
  const scroll = this.scrollY / -20;
  imagenes.forEach((imagen) => {
    imagen.getElementsByClassName.backgroundPositionY = `${scroll}px`;
  });
});
