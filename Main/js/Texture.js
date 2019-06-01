class Texture {
  constructor(nombre,direccion){
    this.nombre = nombre;
    this.direccion = direccion;
    this.textura = null;
  }

  getName(){
    return this.nombre;
  }

  getDir(){
    return this.direccion;
  }

  setTextura(textura){
      this.textura = textura;
  }

  getTextura(){
    return this.textura;
  }
}
