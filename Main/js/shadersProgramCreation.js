var shaderProgramBLinnPhong  = null;
var shaderProgramCookTorrance = null;
var shaderProgramOrenNayar = null;
var shaderProgramCookTorranceShirley = null;
var shaderProgramProcedural1 = null;

/*Funcion para setear uniforms de BlinnPhong*/
function setShaderBlinnPhong(){
  shaderProgram = shaderProgramBLinnPhong;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  texLocation = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'ka');
  u_kd = gl.getUniformLocation(shaderProgram, 'kd');
  u_ks = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_sampler = gl.getUniformLocation(shaderProgram, 'imagen');
  u_MVP = gl.getUniformLocation(shaderProgram, 'MVP');
  u_normalsTexture = gl.getUniformLocation(shaderProgram,'normalsTexture');
  u_vertexTangents = gl.getAttribLocation(shaderProgram,'vertexTangent');
  u_normalMapping = gl.getUniformLocation(shaderProgram,'normalMapping');
}

/*Funcion para setear uniforms de CookTorrance*/
function setShaderCookTorrance(){
  shaderProgram = shaderProgramCookTorrance;
  posLocationCT = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationCT = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrixCT = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixCT = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixCT = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_kaCT = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdCT = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksCT = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrixCT = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspecCT = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_MVCT = gl.getUniformLocation(shaderProgram, 'MV');
  u_F0CT = gl.getUniformLocation(shaderProgram,'F0');
  u_rugosidadCT = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_roCT = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaCT = gl.getUniformLocation(shaderProgram, 'sigma');
  texLocationCT = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_samplerCT = gl.getUniformLocation(shaderProgram, 'imagen');
  u_sampler2CT = gl.getUniformLocation(shaderProgram, 'imagen2');
  u_MVPCT = gl.getUniformLocation(shaderProgram, 'MVP');
  u_normalsTextureCT = gl.getUniformLocation(shaderProgram,'normalsTexture');
  u_vertexTangentsCT = gl.getAttribLocation(shaderProgram,'vertexTangent');
  u_normalMappingCT = gl.getUniformLocation(shaderProgram,'normalMapping');
  console.log("Ya cargue todo lo de Cook Torrance");
}

/*Funcion para setear uniforms de OrenNayar*/
function setShaderOrenNayar(){
  shaderProgram = shaderProgramOrenNayar;
  posLocationON = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationON = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrixON = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixON = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixON = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_kaON = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdON = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksON = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrixON = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_roON = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaON = gl.getUniformLocation(shaderProgram, 'sigma');
  u_MVON = gl.getUniformLocation(shaderProgram, 'MV');
  texLocationON = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_samplerON = gl.getUniformLocation(shaderProgram, 'imagen');
  u_MVPON = gl.getUniformLocation(shaderProgram, 'MVP');
  console.log("Ya cargue todo lo de Oren Nayar");
}

/*Funcion para setear uniforms de Shirley*/
function setShaderCookTorranceShirley(){
  shaderProgram = shaderProgramCookTorranceShirley;
  posLocationS = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationS = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrixS = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixS = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixS = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_kaS = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdS = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksS = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrixS = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspecS = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_MVS = gl.getUniformLocation(shaderProgram, 'MV');
  u_rugosidadS = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0S = gl.getUniformLocation(shaderProgram,'F0');
  u_NuS= gl.getUniformLocation(shaderProgram, 'Nu');
  u_NvS = gl.getUniformLocation(shaderProgram, 'Nv');
  texLocationS = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_samplerS = gl.getUniformLocation(shaderProgram, 'imagen');
  u_MVPS = gl.getUniformLocation(shaderProgram, 'MVP');
  console.log("Ya cargue todo lo de Shirley");
}

function setShaderRayos(){
  shaderProgram = shaderProgramProcedural1;
  posLocationR = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationR = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_normalMatrixR = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_modelMatrixR = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixR = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixR = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_rugosidadR = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0R = gl.getUniformLocation(shaderProgram,'F0');
  u_MVR = gl.getUniformLocation(shaderProgram, 'MV');
  texLocationR = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  //u_MVPR = gl.getUniformLocation(shaderProgram, 'MVP');

}

/*Funcion para crear cada shaderProgram*/
function createShaderPrograms(){
  shaderProgramBLinnPhong = ShaderProgramHelper.create(VS_BlinnPhong_spot, FS_BlinnPhong_spot);
  shaderProgramCookTorrance =  ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
  shaderProgramOrenNayar = ShaderProgramHelper.create(VS_OrenNayar,FS_OrenNayar);
  shaderProgramCookTorranceShirley = ShaderProgramHelper.create(VS_CookTorranceShirley, FS_CookTorranceShirley);
  shaderProgramProcedural1 = ShaderProgramHelper.create(VS_degradacion,fs_degradacion);
}
