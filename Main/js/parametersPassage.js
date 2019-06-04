
/*Funcion que dicta que materiales se dibujan con cada modelo*/
function drawObject(object){
	if(object.getMaterial().getType()=="Metal"){
    drawBlinnPhong(object);
	}
	if(object.getMaterial().getType()=="Plastic"){
		drawBlinnPhong(object);
	}
	if(object.getMaterial().getType()=="Glass"){
    drawBlinnPhong(object);
	}
  if(object.getMaterial().getType()=="Satin"){
    drawBlinnPhong(object);
  }
}

/*Funcion que pasa a los shaders los parametros de la camara*/
function passCamera(){
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
}

/*Funcion que pasa a los shaders los parametros de cada luz*/
function passLight(index,light){
	//Hecho lo mas general posible
	//Creo un string para cada variable y la asocio con un parametro en el shader
	//Posicion
	let str = "lights["+(index-1)+"].posL";
	let u_posL = gl.getUniformLocation(shaderProgram,str);
	//Direccion
	str = "lights["+(index-1)+"].dirL";
	let u_dirL = gl.getUniformLocation(shaderProgram,str);
	//Intensidad o color
	str = "lights["+(index-1)+"].ia";
	let u_ia = gl.getUniformLocation(shaderProgram,str);
	//Angulo (Solo usado si es spot)
	str = "lights["+(index-1)+"].limit";
	let u_limit = gl.getUniformLocation(shaderProgram,str);
	//Tipo. (Como de todas formas tengo que poner ifs en los shader mejor le
	//paso esto y listo)
	str = "lights["+(index-1)+"].type";
	let u_type = gl.getUniformLocation(shaderProgram,str);
	//Comienzo a transformar a coord. vista y pasar los parametros
	//Transformo la posicion
	let spot_position_eye = vec4.create();
	vec4.transformMat4(spot_position_eye,light.getLightPosition(),viewMatrix);
	gl.uniform4fv(u_posL, spot_position_eye);//La paso
	//Color y angulo
	gl.uniform3fv(u_ia, light.getIntensity()[0]);
	gl.uniform1f(u_limit, light.getAngle());
	//Direccion
	let spot_direction_eye = vec4.create();
	vec4.transformMat4(spot_direction_eye,light.getDirection(),viewMatrix);
	gl.uniform4fv(u_dirL, spot_direction_eye);
	//Tipo
	gl.uniform1i(u_type, light.getType());
}




/*En las siguientes funciones se sigue el mismo procedimiento,
Se setea el shaderProgram, se pasan las luces asi como el resto de uniforms*/
var entero = 0;
/*Funcion para dibujar con Blinn Phong*/
function drawBlinnPhong(object){
  setShaderBlinnPhong();
  gl.useProgram(shaderProgram);
  passLight(1,light);
	passLight(2,light2);
	passLight(3,light3);
  passCamera();
	if(entero == 0){
		console.log(object.getTexture());
		entero = 1;
	}
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,object.getTexture());
	gl.uniform1i(shaderProgram.samplerUniform,0);
	gl.uniform1i(u_sampler,0);

	if(entero == 1){
		console.log(object.getNormalsTexture());
		entero = 2;
	}
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D,object.getNormalsTexture());
	gl.uniform1i(shaderProgram.samplerUniform,0);
	gl.uniform1i(u_normalsTexture,1);

	gl.uniform1f(u_normalMapping,normalMappingActivado);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
	let MVP = mat4.create();
	mat4.multiply(MVP,viewMatrix,matrix);
	mat4.multiply(MVP,projMatrix,MVP);
	gl.uniformMatrix4fv(u_MVP,false,MVP);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  gl.uniform1f(u_coefEspec,material.getShininess());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);
  gl.bindVertexArray(null);
  gl.useProgram(null);
}
var entero = 0
/*Funcion para dibujar con Cook Torrance*/
function drawCookTorrance(object){
  //setShaderCookTorrance();
	shaderProgram = shaderProgramCookTorrance;
  gl.useProgram(shaderProgram);
  passCamera();
	for(let i = 0; i<lights.length; i++){
		passLight(i+1,lights[i]);
	}
	// passLight(1,light);
	// passLight(2,light2);
	// passLight(3,light3);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,object.getTexture());
	gl.uniform1i(shaderProgram.samplerUniform,0);
	gl.uniform1i(u_samplerCT,0);
	gl.activeTexture(gl.TEXTURE1);
	if(object.getTexture2()==null && object.getTexture()!=null)
		gl.bindTexture(gl.TEXTURE_2D,getTextureByName("SnowWhite"));
	else
		gl.bindTexture(gl.TEXTURE_2D,object.getTexture2());
	gl.uniform1i(shaderProgram.samplerUniform2,0);
	gl.uniform1i(u_samplerCT,1);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrixCT, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MVCT, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrixCT, false, MV);
	let MVP = mat4.create();
	mat4.multiply(MVP,viewMatrix,matrix);
	mat4.multiply(MVP,projMatrix,MVP);
	gl.uniformMatrix4fv(u_MVPCT,false,MVP);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_kaCT,material.getKa());
  gl.uniform3fv(u_kdCT,material.getKd());
  gl.uniform3fv(u_ksCT,material.getKs());
  gl.uniform1f(u_coefEspecCT,material.getShininess());
	gl.uniform1f(u_F0CT,material.getF0());
	gl.uniform1f(u_rugosidadCT,material.getRugosidad());
	gl.uniform1f(u_roCT,1.0);
	gl.uniform1f(u_sigmaCT,90.0);
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

/*Funcion para dibujar con Oren Nayar*/
function drawOrenNayar(object){
  //setShaderOrenNayar();
	shaderProgram = shaderProgramOrenNayar;
  gl.useProgram(shaderProgram);
  passCamera();
	for(let i = 0; i<lights.length; i++){
		passLight(i+1,lights[i]);
	}
	// passLight(1,light);
	// passLight(2,light2);
	// passLight(3,light3);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,object.getTexture());
	gl.uniform1i(shaderProgram.samplerUniform,0);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrixON, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MVON, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrixON, false, MV);
	let MVP = mat4.create();
	mat4.multiply(MVP,viewMatrix,matrix);
	mat4.multiply(MVP,projMatrix,MVP);
	gl.uniformMatrix4fv(u_MVPON,false,MVP);
  gl.uniform1f(u_roON,1.0);
  gl.uniform1f(u_sigmaON,90.0);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_kaON,material.getKa());
  gl.uniform3fv(u_kdON,material.getKd());
  gl.uniform3fv(u_ksON,material.getKs());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

/*Funcion para dibujar con Shirley*/
function drawCookTorranceShirley(object){
  //setShaderCookTorranceShirley();
	shaderProgram = shaderProgramCookTorranceShirley;
  gl.useProgram(shaderProgram);
  passCamera();
	for(let i = 0; i<lights.length; i++){
		passLight(i+1,lights[i]);
	}
	// passLight(1,light);
	// passLight(2,light2);
	// passLight(3,light3);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,object.getTexture());
	gl.uniform1i(shaderProgram.samplerUniform,0);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrixS, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MVS, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrixS, false, MV);
	let MVP = mat4.create();
	mat4.multiply(MVP,viewMatrix,matrix);
	mat4.multiply(MVP,projMatrix,MVP);
	gl.uniformMatrix4fv(u_MVPS,false,MVP);
  gl.uniform1f(u_rugosidadS,0.84);
  gl.uniform1f(u_F0S,0.51);
  gl.uniform1f(u_NuS,2);
  gl.uniform1f(u_NvS,2);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_kaS,material.getKa());
  gl.uniform3fv(u_kdS,material.getKd());
  gl.uniform3fv(u_ksS,material.getKs());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}
