//Variables para los objetos
var gl = null;

//Uniform values.
var viewMatrix = mat4.create();
var projMatrix = mat4.create();

//Variables para generar la camara esferica
var camaraEsferica;
var eye = [2, 2, 2];
var target = [0, 0, 0];
var up = [0, 1, 0];

//Guardo los sliders para resetear todo a sus posiciones iniciales
//Se cargaran cuando el usuario mueva algun slider
var slider=[];
//Variables de control
var changed = false; //Es true si algun valor fue cambiado desde el ultimo reset
var fullScreen = false;//Es true si esta en pantalla completa
var then = 0;
var rotationSpeed = 30;
var cameraAnimated = false;
//MATERIALES
var materials = [];

//OBJETOS
var obj_cars = [];
var obj_bmw;
var obj_ford;
var obj_ferrari;
var obj_piso;
var ferrari;
var lamborghini;
var bugatti;
var camaro;
var bmw;
var lexus;
var specter;
var nissan;
var ardita;
var rx;
var lancer;
var porsche;


var obj_ball;
var obj_ball2;
var obj_ball3;

var lights = [];
var light;
var light2;
var light3;

var texture;
var enrejado;
var fuego;
var mitsubishi;
var porsche1;
var enrejadoMLE;
var ruedasMLE;


var cameraMouseControls;
/*Esta funcion se ejecuta al cargar la pagina. Carga todos los objetos para que luego sean dibujados, asi como los valores iniciales
de las variables a utilizar*/
async function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');
	gl.clearColor(0.05, 0.05, 0.05, 1.0); //Cambio el color de fondo
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	await onModelLoad();//Cargo los objetos a la escena
	//cargarSliders();//Cargo los sliders
	crearMateriales();//Creacion de MATERIALES
	createShaderPrograms();//Creacion de los shaderPrograms
	setShaderCookTorrance();//Seteo un shaderProgram
	loadMaterials(); //Cargo los materiales a los dropdown menu

	initTexture(); //Creo las texturas

	//Creo autos
	// ferrari = new Car("Ferrari"); //Creo el auto
	// let ferrari_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado]; //Creo un arreglo con las texturas a utilizar HARDCODE
	// let ferrari_colors = ["Pearl","Caucho","Bronze","Glass","Scarlet"]; //Creo un arreglo con los colores a utilizar
	// ferrari.setColors(ferrari_colors); //Seteo Valores
	// ferrari.setOBJ(parsedOBJ_Ferrari);
	// ferrari.setTextures(ferrari_textures);
	// ferrari.setRotation(180);
	// ferrari.setTraslation([0.4,0.05,-1]);
	// ferrari.setScale([0.008,0.008,0.008]);
	//
	// bmw = new Car("BMW");
	// let bmw_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let bmw_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Chrome","Scarlet","Chrome","Chrome","Chrome"];
	// bmw.setColors(bmw_colors);
	// bmw.setOBJ(parsedOBJ_BMW);
	// bmw.setTextures(bmw_textures);
	//
	// lexus = new Car("Lexus");
	// let lexus_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let lexus_colors = ["Polished Gold","Bronze","Caucho","Glass"];
	// lexus.setColors(lexus_colors);
	// lexus.setOBJ(parsedOBJ_Lexus);
	// lexus.setTextures(lexus_textures);
	//
	camaro = new Car("Camaro");
	let camaro_textures = [camaroTexture,null,null,camaroLlantas,null,camaroPlaca,null,null,null,null,null];
	let camaro_colors = ["Scarlet","Polished Bronze","Glass","Chrome","Caucho","Scarlet","Chrome","Silver2","Chrome","Silver2","Brass","Silver2","Caucho","Pearl"];
	camaro.setColors(camaro_colors);
	camaro.setOBJ(parsedOBJ_Camaro);
	camaro.setTextures(camaro_textures);

	// // bugatti = new Car("Bugatti");
	// // let bugatti_textures = [enrejado,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// // let bugatti_colors = ["Pearl","Polished Bronze","Silver","Silver2","Chrome","Caucho","Chrome","Glass","Scarlet","Pearl","Caucho"];
	// // bugatti.setColors(bugatti_colors);
	// // bugatti.setTextures(bugatti_textures);
	// // bugatti.setOBJ(parsedOBJ_Bugatti);
	// // bugatti.setRotation(180);
	// // bugatti.setTraslation([0.04,0.0,-0.8]);
	// // bugatti.setScale([0.002,0.002,0.002]);
	//
	lamborghini = new Car("Lamborghini");
	let lamborghini_textures = [enrejado,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let lamborghini_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	lamborghini.setColors(lamborghini_colors);
	lamborghini.setTextures(lamborghini_textures);
	lamborghini.setOBJ(parsedOBJ_Lamborghini);
	//
	// specter = new Car("Specter");
	// let specter_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let specter_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	// specter.setColors(specter_colors);
	// specter.setTextures(specter_textures);
	// specter.setOBJ(parsedOBJ_Specter);

	// nissan = new Car("Nissan");
	// let nissan_textures = [corvetteTexture,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let nissan_colors = ["Chrome","Glass","Glass","Caucho","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	// nissan.setColors(nissan_colors);
	// nissan.setTextures(nissan_textures);
	// nissan.setOBJ(parsedOBJ_Nissan);


	corvette = new Car("Corvette");
	let corvette_textures = [corvetteTexture,null,null,corvetteWheel,corvetteTexture,null,null,null];
	let corvette_colors = ["Chrome","Glass","Caucho","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	corvette.setColors(corvette_colors);
	corvette.setTextures(corvette_textures);
	corvette.setOBJ(parsedOBJ_Corvette);
	// ardita = new Car("Ardita");
	// let ardita_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let ardita_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	// ardita.setColors(ardita_colors);
	// ardita.setTextures(ardita_textures);
	// ardita.setOBJ(parsedOBJ_Ardita);

	// rx = new Car("RX");
	// let rx_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	// let rx_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	// rx.setColors(rx_colors);
	// rx.setTextures(rx_textures);
	// rx.setOBJ(parsedOBJ_RX);

	lancer = new Car("Lancer");
	let lancer_textures = [mitsubishi,enrejadoMLE,ruedasMLE,null,null,null,null,ruedasMLE,null,null,null];
	let lancer_colors = ["Chrome","Chrome","Glass","Glass","Scarlet","Scarlet","Caucho","Caucho","Caucho","Caucho","Caucho"];
	lancer.setColors(lancer_colors);
	lancer.setTextures(lancer_textures);
	lancer.setOBJ(parsedOBJ_Lancer);

	porsche = new Car("Porsche");
	let porsche_textures = [porsche1,porsche1,ruedasPorsche,ruedasPorsche,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let porsche_colors = ["Chrome","Glass","Bronze","Caucho","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	porsche.setColors(porsche_colors);
	porsche.setTextures(porsche_textures);
	porsche.setOBJ(parsedOBJ_Porsche);

	audiCarrera = new Car("AudiCarrera");
	let audi_textures = [audiTexture,null,null,corvetteTexture,corvetteTexture,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let audi_colors = ["Chrome","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"];
	audiCarrera.setColors(audi_colors);
	audiCarrera.setTextures(audi_textures);
	audiCarrera.setOBJ(parsedOBJ_AudiCarrera);

	supra = new Car("Supra");
	let supra_textures = [supraTexture,null,supraNeumaticos,supraNeumaticos,null,null,null,null,null,null];
	let supra_colors = ["Chrome","Chrome","Chrome","Caucho","Default","Default","Default","Default","Default"];
	supra.setColors(supra_colors);
	supra.setTextures(supra_textures);
	supra.setOBJ(parsedOBJ_Supra);


	//Una vez que termine de crearlos los meto en el arreglo para mejor manejo
	//obj_cars.push(lexus);
	//obj_cars.push(bmw);
	//obj_cars.push(ferrari);
	obj_cars.push(camaro);
	//obj_cars.push(bugatti);
	obj_cars.push(lamborghini);
	//obj_cars.push(specter);
	// obj_cars.push(nissan);
	//obj_cars.push(ardita);
	//obj_cars.push(rx);
	obj_cars.push(lancer);
	obj_cars.push(porsche);
	obj_cars.push(corvette);
	obj_cars.push(audiCarrera);
	obj_cars.push(supra);

	//Creo para cada auto todos los objetos asociados. Chasis, ruedas etc. Se obtienen del arreglo de parsedOBJ
	for(let i = 0; i<obj_cars.length; i++){
		createCar(obj_cars[i],obj_cars[i].getOBJ());
	}
	//Cargo todos los autos en los dropdown
	loadCars();
	//Creo Objetos auxiliares
	// obj_ball = new Object(parsedOBJ2);
	// obj_ball2 = new Object(parsedOBJ3);
	// obj_ball3 = new Object(parsedOBJ5);
	obj_piso = new Object(parsedOBJ4);

	createLights();//Creo las luces
	loadLights();//Las cargo
	light = lights[0];
	light2 = lights[1];
	light3 = lights[2];
	//Creo VAOS
	createVAO(obj_piso);
	// createVAO(obj_ball);
	// createVAO(obj_ball2);
	// createVAO(obj_ball3);
	//Seteo materiales
	obj_piso.setMaterial(getMaterialByName("Ceramic"));
	obj_piso.setTexture(texture);
	// obj_ball.setMaterial(getMaterialByName("Default"));
	// obj_ball2.setMaterial(getMaterialByName("Default"));
	// obj_ball3.setMaterial(getMaterialByName("Default"));


	/*Creacion de camara*/
	//camaraEsferica= new sphericalCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[5]),3,target,up);
	camaraEsferica = new sphericalCamera();
	//viewMatrix=camaraEsferica.createViewMatrix();//Calculo la matriz de vista
	projMatrix = camaraEsferica.projectionMatrix;
	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	transformObjects();//Aplico transformaciones iniciales a cada objeto
	cameraMouseControls = new CameraMouseControls(camaraEsferica, canvas);
	//Dibujara los que esten mas cerca de la pantalla.
	requestAnimationFrame(onRender)//Pido que inicie la animacion ejecutando onRender
}

/*Este metodo se llama constantemente gracias al metodo requestAnimationFrame(). En los sliders no
se llama al onRender, sino que unicamente actualiza valores. Luego el onRender recupera esos valores y transforma
los objetos como corresponda.*/
var toDraw=["Porsche","Camaro","Corvette"];//Arreglo con los nombres de los autos a dibujar
var last = 0; //Variables para contar fps
var count = 0;
var deltaTime;
function onRender(now){
	now *= 0.001; //Tiempo actual
	deltaTime = now - then; //El tiempo que paso desde la ultima llamada al onRender y la actual
	count++;//Aumento fps
	if(now - last> 1){
		document.getElementById("fps").innerText = "FPS: "+count;
		count = 0;
		last = now;
	}
	then = now; //Actualizo el valor
	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	refreshCamera(deltaTime * rotationSpeed); //Refresco la camara
//	obj_ball.resetObjectMatrix();
	transformCars(toDraw[0],1); //acomodo los autos de manera que se dibujen correctamente en el orden dado en el arreglo
	transformCars(toDraw[1],0);
	transformCars(toDraw[2],-1);
	drawCars(toDraw); //dibujo los autos en el arreglo

//	transformBall();//Transformo indicadores de luces
	// drawObject(obj_ball); //dibujo indicadores de luces
	// drawObject(obj_ball2);
	// drawObject(obj_ball3);
	drawObject(obj_piso); //Dibujo piso
	requestAnimationFrame(onRender); //Continua el bucle
}

/*metodo auxiliar para elegir el metodo correcto de transformacion*/
function transformCars(name,traslate){
	let auto = getCarByName(name);
	let nombre = auto.getName();
	if(nombre=="Lexus")
		transformLexus(traslate);
	if(nombre=="Bugatti")
		transformBugatti(traslate);
	if(nombre=="BMW")
		transformBMW(traslate);
	if(nombre=="Ferrari")
		transformFerrari(traslate);
	if(nombre=="Camaro")
		transformCamaro(traslate);
	if(nombre=="Lamborghini")
		transformLamborghini(traslate);
	if(nombre=="Specter")
		transformSpecter(traslate);
	if(nombre=="Nissan")
		transformNissan(traslate);
	if(nombre=="Ardita")
		transformArdita(traslate);
	if(nombre=="RX")
		transformRX(traslate);
	if(nombre=="Lancer")
		transformLancer(traslate);
	if(nombre=="Porsche")
		transformPorsche(traslate);
	if(nombre == "Corvette")
		transformCorvette(traslate);
	if(nombre == "AudiCarrera")
		transformAudi(traslate);
	if(nombre == "Supra")
		transformSupra(traslate);
}

/*Metodo auxiliar para inciar texturas*/
function initTexture(){
	texture = gl.createTexture();
	enrejado = gl.createTexture();
	fuego = gl.createTexture();
	mitsubishi = gl.createTexture();
	porsche1 = gl.createTexture();
	enrejadoMLE = gl.createTexture();
	ruedasMLE = gl.createTexture();
	ruedasPorsche = gl.createTexture();
	camaroTexture = gl.createTexture();
	camaroPlaca = gl.createTexture();
	camaroLlantas = gl.createTexture();
	corvetteTexture = gl.createTexture();
	corvetteWheel = gl.createTexture();
	audiTexture = gl.createTexture();
	supraTexture = gl.createTexture();
	supraNeumaticos = gl.createTexture();
	texture.image = new Image();
	enrejado.image = new Image();
	fuego.image = new Image();
	mitsubishi.image = new Image();
	porsche1.image = new Image();
	enrejadoMLE.image = new Image();
	ruedasMLE.image = new Image();
	ruedasPorsche.image = new Image();
	camaroTexture.image = new Image();
	camaroPlaca.image = new Image();
	camaroLlantas.image = new Image();
	corvetteTexture.image = new Image();
	corvetteWheel.image = new Image();
	audiTexture.image = new Image();
	supraTexture.image = new Image();
	supraNeumaticos.image = new Image();
	texture.image.onload = function(){
		handleLoadedTexture(texture);
	}
	enrejado.image.onload = function(){
		handleLoadedTexture(enrejado);
	}
	fuego.image.onload = function(){
		handleLoadedTexture(fuego);
	}
	mitsubishi.image.onload = function(){
		handleLoadedTexture(mitsubishi)
	}
	porsche1.image.onload = function(){
		handleLoadedTexture(porsche1);
	}
	enrejadoMLE.image.onload= function(){
		handleLoadedTexture(enrejadoMLE);
	}
	ruedasMLE.image.onload = function(){
		handleLoadedTexture(ruedasMLE);
	}
	ruedasPorsche.image.onload = function(){
		handleLoadedTexture(ruedasPorsche);
	}
	camaroTexture.image.onload = function(){
		handleLoadedTexture(camaroTexture);
	}
	camaroPlaca.image.onload = function(){
		handleLoadedTexture(camaroPlaca);
	}
	camaroLlantas.image.onload = function(){
		handleLoadedTexture(camaroLlantas);
	}
	corvetteTexture.image.onload = function(){
		handleLoadedTexture(corvetteTexture);
	}
	corvetteWheel.image.onload = function(){
		handleLoadedTexture(corvetteWheel);
	}
	audiTexture.image.onload = function(){
		handleLoadedTexture(audiTexture);
	}
	supraTexture.image.onload = function(){
		handleLoadedTexture(supraTexture);
	}
	supraNeumaticos.image.onload = function(){
		handleLoadedTexture(supraNeumaticos);
	}
	fuego.image.src = "textures/fuego.png";
	texture.image.src = "textures/fondo-textura-marmol-textura-marmoles-tailandia-marmol-natural-abstracto-blanco-negro-gris-diseno_1253-914.jpg";
	enrejado.image.src = "textures/BMWM3GTR.jpg";
	mitsubishi.image.src = "textures/Mitsubishi/MLE-texture.jpg";
	porsche1.image.src = "textures/Porsche/skin07/0000.bmp";
	enrejadoMLE.image.src = "textures/Mitsubishi/MLE-opacity.jpg"
	ruedasMLE.image.src = "textures/Mitsubishi/MLE-wheel.jpg"
	ruedasPorsche.image.src = "textures/Porsche/car/0000.bmp"
	camaroTexture.image.src = "textures/Camaro/Lines1.png"
	camaroPlaca.image.src = "textures/Camaro/plaque2.jpg"
	camaroLlantas.image.src = "textures/Camaro/CAMARO RIM.png"
	corvetteTexture.image.src = "textures/Corvette/albedo_esterno.jpg"
	audiTexture.image.src = "textures/WEILL_Thomas_DIFF.png"
	corvetteWheel.image.src = "textures/Corvette/wheels.png"
	supraTexture.image.src = "textures/Supra/Material__0_Diffuse.png";
	supraNeumaticos.image.src = "textures/Supra/BBW_diffuse.png"
}

/*Metodo auxiliar para iniciar texturas*/
function handleLoadedTexture(texture){
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture.image);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D,null);
}

/*Metodo auxiliar para crear VAOS*/
function createVAO(object){
	object.setVao(VAOHelper.create(object.getIndices(), [
		new VertexAttributeInfo(object.getPositions(), posLocation, 3),
		new VertexAttributeInfo(object.getNormals(), vertexNormal_location, 3),
		new VertexAttributeInfo(object.getTextures(),texLocation,2)
	]));
}

/*Dado un auto y un arreglo de OBJ creo todos los objetos asociados a cada auto*/
function createCar(car,parsedOBJ_arr){
	let colors = car.getColors();
	let textures = car.getTextures();
	for(let i = 0 ; i<parsedOBJ_arr.length; i++){
		let objeto = new Object(parsedOBJ_arr[i]);
		createVAO(objeto);
		objeto.setTexture(textures[i]);
		if(i<colors.length)
			objeto.setMaterial(getMaterialByName(colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		car.addObject(objeto);
	}
}


//Transformaciones iniciales a cada objeto
function transformObjects(){
	/*Actualizo las transformaciones para cada uno de los objetos*/
	transformPiso();
	//transformBall();
}

/*Funcion auxiliar para dibujar los autos*/
function drawCars(carsArr){
	for(let k = 0; k<carsArr.length;k++){ //Para cada nombre en el arreglo a dibujar
		let auto = getCarByName(carsArr[k]); //Obtengo el auto con ese nombre
		let objetos = auto.getObjects(); //Obtengo todos los objetos asociados a ese auto
		for(let j = 0; j<objetos.length; j++){
			drawObject(objetos[j]); //Dibujo todos los objetos
		}
	}
}

/*Metodo auxiliar para obtener un auto a partir de su nombre*/
function getCarByName(name){
	for(let i=0; i<obj_cars.length; i++){
		if(obj_cars[i].getName() == name){
			return obj_cars[i];
		}
	}
	return obj_cars[0];
}


function refreshCamera(value){
	if(cameraAnimated){
		camaraEsferica.arcHorizontally(glMatrix.toRadian(value));
	}
	viewMatrix = camaraEsferica.viewMatrix;
	projMatrix = camaraEsferica.projectionMatrix;
}

/*Funcion para cargar los objetos*/
async function onModelLoad() {

	parsedOBJ4 = await parseFile("../Modelos/caja.obj");

	const a = await parseFile("../Modelos/Mitsubishi/mitsubishi_chasis.obj")
	const b = await parseFile("../Modelos/Mitsubishi/mitsubishi_enrejados.obj")
	const c = await parseFile("../Modelos/Mitsubishi/mitsubishi_llantas.obj")
	const d = await parseFile("../Modelos/Mitsubishi/mitsubishi_vidrios.obj")
	const e = await parseFile("../Modelos/Mitsubishi/mitsubishi_azul.obj")
	const f = await parseFile("../Modelos/Mitsubishi/mitsubishi_blanco.obj")
	const g = await parseFile("../Modelos/Mitsubishi/mitsubishi_rojo.obj")
	const h = await parseFile("../Modelos/Mitsubishi/mitsubishi_neumaticos.obj");
	const i = await parseFile("../Modelos/Mitsubishi/mitsubishi_luces.obj");
	console.log("Mitsubishi Lancer Evolution Cargado");
	parsedOBJ_Lancer = [a,b,c,d,e,f,g,h,i];


	const pa = await parseFile("../Modelos/Porsche/porsche_chasis.obj");
	const pb = await parseFile("../Modelos/Porsche/porsche_vidrios.obj");
	const pc = await parseFile("../Modelos/Porsche/porsche_llantas.obj");
	const pd = await parseFile("../Modelos/Porsche/porsche_neumaticos.obj");
	console.log("Porsche 911 GTR Cargado");
	parsedOBJ_Porsche = [pa,pb,pc,pd];

	const ca = await parseFile("../Modelos/Camaro/camaro_chasis.obj");
	const cb = await parseFile("../Modelos/Camaro/camaro_chevrolet.obj");
	const cc = await parseFile("../Modelos/Camaro/camaro_vidrios.obj");
	const cd = await parseFile("../Modelos/Camaro/camaro_llantas.obj");
	const ce = await parseFile("../Modelos/Camaro/camaro_ruedas.obj");
	const cf = await parseFile("../Modelos/Camaro/camaro_patentes.obj");
	const cg = await parseFile("../Modelos/Camaro/camaro_plasticos.obj");
	const ch = await parseFile("../Modelos/Camaro/camaro_logos.obj");
	console.log("Chevrolet Camaro 2009 Cargado");
	parsedOBJ_Camaro = [ca,cb,cc,cd,ce,cf	,cg,ch];

	const la = await parseFile("../Modelos/BMW2/bmw_chasis.obj");
	console.log("Lamborghini Aventador Cargado");
	parsedOBJ_Lamborghini = [la];

	// const na = await parseFile("../Modelos/Nissan/nissan_chasis.obj");
	// const nb = await parseFile("../Modelos/Nissan/nissan_vidrios.obj");
	// const nc = await parseFile("../Modelos/Nissan/nissan_llantas.obj");
	// const nd = await parseFile("../Modelos/Nissan/nissan_neumaticos.obj");
	//
	//
	//
	// parsedOBJ_Nissan = [na,nb,nc,nd];

	const corvetteA = await parseFile("../Modelos/Corvette/corvette_chasis.obj");
	const corvetteB = await parseFile("../Modelos/Corvette/corvette_vidrios.obj");
	const corvetteC = await parseFile("../Modelos/Corvette/corvette_neumaticos.obj");
	const corvetteD = await parseFile("../Modelos/Corvette/corvette_llantas.obj");
	const corvetteE = await parseFile("../Modelos/Corvette/corvette_discoFreno.obj");
	console.log("Corvette Cargado");
	parsedOBJ_Corvette = [corvetteA,corvetteB,corvetteC,corvetteD,corvetteE];


	const audiA = await parseFile("../Modelos/audiCarrera.obj");
	console.log("Audi R18 Cargado");
	parsedOBJ_AudiCarrera = [audiA];


	const supraA = await parseFile("../Modelos/Supra/supra_chasis.obj");
	const supraB = await parseFile("../Modelos/Supra/supra_vidrios.obj");
	const supraC = await parseFile("../Modelos/Supra/supra_llantas.obj");
	const supraD = await parseFile("../Modelos/Supra/supra_neumaticos.obj");
	console.log("Toyota Supra Cargado");
	parsedOBJ_Supra = [supraA,supraB,supraC,supraD];

}
