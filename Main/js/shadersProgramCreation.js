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
  u_MVPR = gl.getUniformLocation(shaderProgram, 'MVP');
  u_kaR = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdR = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksR = gl.getUniformLocation(shaderProgram, 'ks');
  u_coefEspecR = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_roR = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaR = gl.getUniformLocation(shaderProgram, 'sigma');
  u_colorRayos = gl.getUniformLocation(shaderProgram, 'colorRayo');
}

function setShaderDegradacion(){
  shaderProgram = shaderProgramProcedural2;
  posLocationD = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationD = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_normalMatrixD = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_modelMatrixD = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixD = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixD = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_rugosidadD = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0D = gl.getUniformLocation(shaderProgram,'F0');
  u_MVD = gl.getUniformLocation(shaderProgram, 'MV');
  texLocationD = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_MVPD = gl.getUniformLocation(shaderProgram, 'MVP');
  u_kaD = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdD = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksD = gl.getUniformLocation(shaderProgram, 'ks');
  u_coefEspecD = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_roD = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaD = gl.getUniformLocation(shaderProgram, 'sigma');
}

function setShaderLava(){
  shaderProgram = shaderProgramProcedural3;
  posLocationL = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationL = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_normalMatrixL = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_modelMatrixL = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixL = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixL = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_rugosidadL = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0L = gl.getUniformLocation(shaderProgram,'F0');
  u_MVL = gl.getUniformLocation(shaderProgram, 'MV');
  texLocationL = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_MVPL = gl.getUniformLocation(shaderProgram, 'MVP');
  u_kaL = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdL = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksL = gl.getUniformLocation(shaderProgram, 'ks');
  u_coefEspecL = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_roL = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaL = gl.getUniformLocation(shaderProgram, 'sigma');
  uTimeL = gl.getUniformLocation(shaderProgram, "u_time");
}

function setShaderHumo(){
  shaderProgram = shaderProgramProcedural4;
  posLocationH = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_locationH = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_normalMatrixH = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_modelMatrixH = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrixH = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrixH = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_rugosidadH = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0H = gl.getUniformLocation(shaderProgram,'F0');
  u_MVH = gl.getUniformLocation(shaderProgram, 'MV');
  texLocationH = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_MVPH = gl.getUniformLocation(shaderProgram, 'MVP');
  u_kaH = gl.getUniformLocation(shaderProgram, 'ka');
  u_kdH = gl.getUniformLocation(shaderProgram, 'kd');
  u_ksH = gl.getUniformLocation(shaderProgram, 'ks');
  u_coefEspecH = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_roH = gl.getUniformLocation(shaderProgram,'p');
  u_sigmaH = gl.getUniformLocation(shaderProgram, 'sigma');
  uTime = gl.getUniformLocation(shaderProgram, "u_time");
}

/*Funcion para crear cada shaderProgram*/
function createShaderPrograms(){
  shaderProgramBLinnPhong = ShaderProgramHelper.create(VS_BlinnPhong_spot, FS_BlinnPhong_spot);
  shaderProgramCookTorrance =  ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
  shaderProgramOrenNayar = ShaderProgramHelper.create(VS_OrenNayar,FS_OrenNayar);
  shaderProgramCookTorranceShirley = ShaderProgramHelper.create(VS_CookTorranceShirley, FS_CookTorranceShirley);
  shaderProgramProcedural1 = ShaderProgramHelper.create(VS_Rayos,FS_Rayos);
  shaderProgramProcedural2 = ShaderProgramHelper.create(VS_Degradacion,FS_Degradacion);
  shaderProgramProcedural3 = ShaderProgramHelper.create(VS_Lava,FS_Lava);
  shaderProgramProcedural4 = ShaderProgramHelper.create(VS_Humo,FS_Humo);
}
