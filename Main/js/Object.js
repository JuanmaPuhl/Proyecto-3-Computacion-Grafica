class Object{

  constructor(parsedOBJ){
    this.parsedOBJ = parsedOBJ;
    this.indices = this.parsedOBJ.indices;
    this.positions = this.parsedOBJ.positions;
    this.colors = this.parsedOBJ.positions;
    this.normals = this.parsedOBJ.normals;
    this.indexCount = this.indices.length;
    this.objectMatrix = mat4.create();
    this.animated = false;
    this.vao = null;
    this.center = Utils.boundingBoxCenter(this.positions);
    this.material = null;
    this.textures = this.parsedOBJ.textures;
    this.texture = null;
    this.texture2 = null;
  }
  setTexture2(texture2){
    this.texture2 = texture2;
  }

  setTexture(texture){
    this.texture = texture;
  }

  getTexture(){
    return this.texture;
  }

  getTexture2(){
    return this.texture2;
  }
  /*-------------------SETTERS-------------------*/
  setCenter(center){
    this.center = center;
  }

  setVao(vao){
    this.vao = vao;
  }

  setMaterial(material){
    this.material = material;
  }

  animate(value){
    this.animated = value;
  }

  resetObjectMatrix(){
    this.objectMatrix = mat4.create();
  }

  /*--------------------GETTERS-------------------*/

  getTextures(){
    return this.textures;
  }

  getIndices(){
    return this.indices;
  }

  getPositions(){
    return this.positions;
  }

  getColors(){
    return this.colors;
  }

  getNormals(){
    return this.normals;
  }

  getIndexCount(){
    return this.indexCount;
  }

  getMaterial(){
    return this.material;
  }

  getObjectMatrix(){
    return this.objectMatrix;
  }

  getVao(){
    return this.vao;
  }

  getCenter(){
    return this.center;
  }

  isAnimated(){
    return this.animated;
  }


}
