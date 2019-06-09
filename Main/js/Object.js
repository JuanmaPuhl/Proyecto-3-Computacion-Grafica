class Object{

  constructor(parsedOBJ){
    this.parsedOBJ = parsedOBJ;
    this.indices = this.parsedOBJ.indexTriangles;
    this.positions = this.parsedOBJ.vertexPositions;
    this.colors = this.parsedOBJ.vertexPositions;
    this.normals = this.parsedOBJ.vertexNormals;
    this.indexCount = this.indices.length;
    this.objectMatrix = mat4.create();
    this.animated = false;
    this.vao = null;
    this.center = Utils.boundingBoxCenter(this.positions);
    this.material = null;
    this.textures = this.parsedOBJ.vertexTextureCoordinates;
    this.texture = null;
    this.texture2 = null;
    this.texture3 = null;
    this.tangents = this.parsedOBJ.vertexTangents;
    this.normalsTexture = null;
    this.textureType = "Normal";
  }
  setTextureType(type){
    this.textureType=type;
  }
  setTexture2(texture2){
    this.texture2 = texture2;
  }
  setTexture3(texture3){
    this.texture3 = texture3;
  }
  getTextureType(){
    return this.textureType;
  }
  setTexture(texture){
    this.texture = texture;
  }
  setNormalsTexture(texture){
    this.normalsTexture = texture;
  }

  getNormalsTexture(){
    return this.normalsTexture;
  }
  getTexture(){
    return this.texture;
  }

  getTexture2(){
    return this.texture2;
  }

  getTexture3(){
    return this.texture3;
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

  getTangents(){
    return this.tangents;
  }

}
