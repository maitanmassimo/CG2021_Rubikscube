var canvas;

var obj_files = [
	"Cube00","Cube00_B","Cube00_M",
	"Cube01","Cube01_B","Cube01_M",
	"Cube02","Cube02_B","Cube02_M",
	"Cube10","Cube10_B","Cube10_M",
	"Cube11","Cube11_B",
	"Cube12","Cube12_B","Cube12_M",
	"Cube20","Cube20_B","Cube20_M",
	"Cube21","Cube21_B","Cube21_M",
	"Cube22","Cube22_B","Cube22_M"
];
var texture_url = "lib/models/Rubiks Cube.png";
var gl = null,
	program = null,
	mesh = null;
	var cubeWorldMatrix;    //One world matrix for each cube...
	var objStr;
	//Light params
	var lightColor = [0.1, 1.0, 1.0];
	var lightPos = [0.0, 1.5, 2.0,1.0];
	var lightTarget = 10;
	var lightDecay = 0;
	//Define material color
	var cubeMaterialColor = [0.5, 0.5, 0.5];
	var lookRadius = 10;
	var vao = new Array();
	var modelVertices = new Array();
	var modelIndices =  new Array();
	var modelTexCoords = new Array();
	var uvLocation = new Array();

	var lastUpdateTime = (new Date).getTime();
	//Camera parameters
	var cx = 10.0;
	var cy = 10.0;
	var cz = 2.5;
	var elevation = -45.0;
	var angle = -40.0;
	var ind = 0;
	//Model parameters
	var cubeTx = new Array();//0.0;
	var cubeTy = new Array();//0.0;
	var cubeTz = new Array();//-1.0;
	var cubeRx = new Array();//0.0;
	var cubeRy = new Array();//0.0;
	var cubeRz = new Array();//0.0;
	var cubeS = new Array();//0.5;

	var topLevelCubes = [["22", "12", "02"],["21", "11", "01"],["20","10", "00"]];
	var middleLevelCubes = [["22M", "12M", "02M"],["21M", "EMPTY", "01M"],["20M","10M", "00M"]];
	var bottomLevelCubes = [["22B", "12B", "02B"],["21B", "11B", "01B"],["20B","10B", "00B"]];
	var k=true;
	var map = {};	



cubeWorldMatrix = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);

keyFunction = function(e){
    //e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    
	console.log(map);

	if (map[76]&& map[16]) {	// L
		displayLeftCCWRotation();
		updateLeftCCWRotation();
	}else if(map[76] && !map[16]){
		displayLeftCWRotation();
		updateLeftCWRotation();
		
	}
	else if (map[82] && map[16]) {	// R
		displayRightCCWRotation();
		updateRightCCWRotation();
	}else if(map[82] && !map[16]){
		displayRightCWRotation();
		updateRightCWRotation();
		
	}
	else if (map[84] && map[16]) {	// T	
		displayTopCCWRotation();
		updateTopCCWRotation();
	}else if(map[84] && !map[16]){
		displayTopCWRotation();
		updateTopCWRotation();
		
	}
	else if (map[66] && map[16]) {	// T	
		displayBottomCCWRotation();
		updateBottomCCWRotation();
	}else if(map[66] && !map[16]){
		displayBottomCWRotation();
		updateBottomCWRotation();
		
	}
}

keyClear = function(e){
	map[e.keyCode] = false;
}

//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keydown", keyFunction, false);
window.addEventListener("keyup", keyClear, false);


// Vertex shader
var vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 a_uv;

out vec3 fsPosition;
out vec3 fsNormal;
out vec2 uvCoord;

uniform mat4 matrix;
uniform mat4 pMatrix;     //matrix to transform positions
uniform mat4 nMatrix;




void main() {
  fsNormal =  mat3(nMatrix) * inNormal;
  fsPosition = (pMatrix * vec4(inPosition, 1.0)).xyz;
  gl_Position = matrix * vec4(inPosition, 1.0);
	uvCoord = a_uv;
}`;

var fs = `#version 300 es

precision mediump float;
in vec2 uvCoord;
in vec3 fsNormal;
in vec3 fsPosition;
out vec4 outColor;

uniform vec3 mDiffColor; //material diffuse color
uniform vec3 LAlightColor; //point light color
uniform vec3 LAPos; //point light position
uniform float LATarget; //point light target
uniform float LADecay; //point light decay
uniform sampler2D sampler;

void main() {

  vec3 lightColorA = LAlightColor * pow(LATarget / length(LAPos - fsPosition), LADecay);

  vec3 nNormal = normalize(fsNormal);
  vec3 lightDirNorm = normalize(LAPos - fsPosition);
  vec3 lambertColour = mDiffColor * lightColorA * dot(lightDirNorm,nNormal);

  outColor = texture(sampler, uvCoord);


}`;

// event handler

var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	mouseState = true;
	//drawScene();
}
function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	mouseState = false;
	//	drawScene();
}

function doMouseMove(event) {
	if(mouseState) {
		var dx = event.pageX - lastMouseX;
		var dy = lastMouseY - event.pageY;
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if((dx != 0) || (dy != 0)) {
			angle = angle + 0.25 * dx;
			elevation = elevation + 0.25 * dy;
		}
	}
//	drawScene();
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 2.0) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
//		drawScene();
}

function updateRightCWRotation(){
	let topTmp = topLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	let middleTmp = middleLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	let bottomTmp = bottomLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	var localMatrix = [topTmp,middleTmp, bottomTmp];
	
	for(var i = 0; i < 3; i++){
		
		topLevelCubes[i][2] = localMatrix[i][2]; 
		middleLevelCubes[i][2] = localMatrix[i][1];		
		bottomLevelCubes[i][2] = localMatrix[i][0];		
	}	
}

function updateRightCCWRotation(){
	let topTmp = topLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	let middleTmp = middleLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	let bottomTmp = bottomLevelCubes.map(function(value,index) { return value[2]; }); //takes the last column
	var localMatrix = [topTmp,middleTmp, bottomTmp];
	
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][2] = localMatrix[i][0]; 
		middleLevelCubes[i][2] = localMatrix[i][1];
		bottomLevelCubes[i][2] = localMatrix[i][2];
	}
}

function updateLeftCWRotation(){
	let topTmp = topLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	let middleTmp = middleLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	let bottomTmp = bottomLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	var localMatrix = [topTmp,middleTmp, bottomTmp];
	
	for(var i = 0; i < 3; i++){
		
		topLevelCubes[i][0] = localMatrix[i][2]; 
		middleLevelCubes[i][0] = localMatrix[i][1];		
		bottomLevelCubes[i][0] = localMatrix[i][0];		
	}	
}

function updateLeftCCWRotation(){
	let topTmp = topLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	let middleTmp = middleLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	let bottomTmp = bottomLevelCubes.map(function(value,index) { return value[0]; }); //takes the last column
	var localMatrix = [topTmp,middleTmp, bottomTmp];
	
	for(var i = 0; i < 3; i++){
		
		topLevelCubes[i][0] = localMatrix[i][0]; 
		middleLevelCubes[i][0] = localMatrix[i][1];		
		bottomLevelCubes[i][0] = localMatrix[i][2];		
	}	
}

function updateTopCCWRotation(){
	
	let row1 = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let row2 = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let row3 = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;

	var localMatrix = [row1, row2, row3];
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		
		topLevelCubes[i][0] = localMatrix[0][2-i]; 	
		topLevelCubes[i][1] = localMatrix[1][2-i]; 
		topLevelCubes[i][2] = localMatrix[2][2-i]; 
	}	
	console.log(topLevelCubes);
}

function updateTopCWRotation(){
	let row1 = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let row2 = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let row3 = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;


	var localMatrix = [row1, row2, row3];
	console.log(localMatrix);
	
	for(var i = 0; i < 3; i++){		
		topLevelCubes[i][0] = localMatrix[2][i]; 	
		topLevelCubes[i][1] = localMatrix[1][i]; 
		topLevelCubes[i][2] = localMatrix[0][i]; 
	}	
	console.log(topLevelCubes);
}

function updateBottomCCWRotation(){
	
	let row1 = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let row2 = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let row3 = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;

	var localMatrix = [row1, row2, row3];
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		
		bottomLevelCubes[i][0] = localMatrix[0][2-i]; 	
		bottomLevelCubes[i][1] = localMatrix[1][2-i]; 
		bottomLevelCubes[i][2] = localMatrix[2][2-i]; 
	}	
	console.log(bottomLevelCubes);
}

function updateBottomCWRotation(){
	let row1 = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let row2 = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let row3 = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;


	var localMatrix = [row1, row2, row3];
	console.log(localMatrix);
	
	for(var i = 0; i < 3; i++){		
		bottomLevelCubes[i][0] = localMatrix[2][i]; 	
		bottomLevelCubes[i][1] = localMatrix[1][i]; 
		bottomLevelCubes[i][2] = localMatrix[0][i]; 
	}	
	console.log(bottomLevelCubes);
}

function mapValueToArrayIndex(val){
	//[00, 00_B, 00_M, 01, 01B, 01M, 02, 02B, 02M, 10, 10B, 10M, 11, 11B, 12, 12B, 12M, 20, 20B, 20M, 21, 21B, 21M, 22, 22B, 22M]
	switch(val) {
		case "00":
		  return 0;
		  break;
		case "00B":
		  return 1;
		  break;
		case "00M":
			return 2;
			break;
		case "01":
			return 3;
			break;
		case "01B":
			return 4;
			break;
		case "01M":
			return 5;
			break;
		case "02":
			return 6;
			break;
		case "02B":
			return 7;
			break;
		case "02M":
			return 8;
			break;	
		case "10":
			return 9;
			break;
		case "10B":
			return 10;
			break;
		case "10M":
			return 11;
			break;
		case "11":
			return 12;
			break;
		case "11B":
			return 13;
			break;
		case "12":
			return 14;
			break;
		case "12B":
			return 15;
			break;
		case "12M":
			return 16;
			break;
		case "20":
			return 17;
			break;
		case "20B":
			return 18;
			break;
		case "20M":
			return 19;
			break;
		case "21":
			return 20;
			break;
		case "21B":
			return 21;
			break;
		case "21M":
			return 22;
			break;
		case "22":
			return 23;
			break;
		case "22B":
			return 24;
			break;
		case "22M":
			return 25;
			break;	
	}
}


function displayRightCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRy[mapValueToArrayIndex(topLevelCubes[i][2])] -= 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][2])]  -= 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][2])] -= 90;
	}
}

function displayRightCCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRy[mapValueToArrayIndex(topLevelCubes[i][2])] += 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][2])]  += 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][2])] += 90;
	}
}

function displayLeftCCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRy[mapValueToArrayIndex(topLevelCubes[i][0])] -= 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][0])]  -= 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][0])] -= 90;
	}
}

function displayLeftCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRy[mapValueToArrayIndex(topLevelCubes[i][0])] += 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][0])]  += 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][0])] += 90;
	}
}

function displayTopCCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][0])] -= 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][1])] -= 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][2])] -= 90;
	}
}

function displayTopCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][0])] += 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][1])] += 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][2])] += 90;
	}
}

function displayBottomCCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][0])] -= 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][1])] -= 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][2])] -= 90;
	}
}

function displayBottomCWRotation(){	
	for(let i = 0; i < 3; i++){
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][0])] += 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][1])] += 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][2])] += 90;
	}
}

function main(){


	// get the context and attach events
	var canvas = document.getElementById("my-canvas");
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener("mouseup", doMouseUp, false);
	canvas.addEventListener("mousemove", doMouseMove, false);
	canvas.addEventListener("mousewheel", doMouseWheel, false);
	//Check that the GET was successful
	try{
		gl= canvas.getContext("webgl2");
	} catch(e){
		console.log(e);
	}

	if(gl){
		//Program creation for the rubik element
		program = gl.createProgram();

		// Compile and link shaders
		var v1 = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(v1, vs);
		gl.compileShader(v1);
		if (!gl.getShaderParameter(v1, gl.COMPILE_STATUS)) {
			alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(v1));
		}

		var v2 = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(v2, fs)
		gl.compileShader(v2);
		if (!gl.getShaderParameter(v2, gl.COMPILE_STATUS)) {
			alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(v2));
		}

		gl.attachShader(program, v1);
		gl.attachShader(program, v2);
		gl.linkProgram(program);

		gl.useProgram(program);

		//Get the location of all the attributes in shaders and fading
		var positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
		var normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
		var matrixLocation = gl.getUniformLocation(program, "matrix");
		var materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
		var lightColorHandle = gl.getUniformLocation(program, 'LAlightColor');
		var vertexMatrixPositionHandle = gl.getUniformLocation(program, "pMatrix");
		var normalMatrixPositionHandle = gl.getUniformLocation(program, "nMatrix");
		var lightPosLocation = gl.getUniformLocation(program, "LAPos");
		var lightTargetLocation = gl.getUniformLocation(program, "LATarget");
		var lightDecayLocation = gl.getUniformLocation(program, "LADecay");
		var textLocation = gl.getUniformLocation(program, "sampler");
		var uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

		perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
		//_______________________________Loading texture____________________________________________
		// Create a texture.
		var texture = gl.createTexture();
		// use texture unit 0
		gl.activeTexture(gl.TEXTURE0);
		// bind to the TEXTURE_2D bind point of texture unit 0
		gl.bindTexture(gl.TEXTURE_2D, texture);
		// Asynchronously load an image
		var image = new Image();
		image.src = texture_url;
		image.onload = function() {
				//Make sure this is the active one
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, texture);
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

				gl.generateMipmap(gl.TEXTURE_2D);
			};
		//_____________________________________________________________________________________

		//sets the viewport, which specifies the affine transformation of x and y
		//from normalized device coordinates to window coordinates
		var w=canvas.clientWidth;
		var h=canvas.clientHeight;
			//void gl.clearColor(red, green, blue, alpha);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.viewport(0.0, 0.0, w, h);

		// If we have not done yet, we load the rubik model
		if (k){
			loadModel();
		}

	 // turn on depth testing
	  gl.enable(gl.DEPTH_TEST);
		drawScene();
	}else{
		alert("Error: WebGL not supported by your browser!");
	}

	async function loadModel(){
		k = false;
		for(var ind = 0; ind < obj_files.length; ind ++ ){
			// Load mesh using the webgl-obj-loader library
			objStr = await utils.get_objstr("lib/models/" + obj_files[ind] + ".obj");
			
			var objModel = new OBJ.Mesh(objStr);
			vao[ind] = gl.createVertexArray();
			gl.bindVertexArray(vao[ind]);
	//_____________________________________________________________________________________
			modelVertices[ind] = objModel.vertices; //Array of vertices

			var positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelVertices[ind]), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(positionAttributeLocation);
			gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
	//_____________________________________________________________________________________
			var modelNormals = objModel.normals; //Array of normals
			var normalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelNormals), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(normalAttributeLocation);
			gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

	//_____________________________________________________________________________________
			modelIndices[ind]= objModel.indices; //Array of indices
			var indexBuffer = gl.createBuffer();
			//Here the buffer must be gl.ELEMENT_ARRAY_BUFFER to specify it contains indices
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelIndices[ind]), gl.STATIC_DRAW);
			//bind index buffer to be sure that is the current active
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			//drawElements uses the indices to draw the primitives
			gl.drawElements(gl.TRIANGLES, modelIndices[ind].length, gl.UNSIGNED_SHORT, 0 );
	//_____________________________________________________________________________________
			uvLocation[ind] = gl.getAttribLocation(program , "a_uv");

			modelTexCoords[ind] = objModel.textures; //Array of uv coordinates
			var textureCoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(modelTexCoords[ind]),gl.STATIC_DRAW);
			gl.vertexAttribPointer(uvLocation[ind], 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(uvLocation[ind]);

		//Matrix generation for the cube
		// each array follows the following cube order: 
		//[00, 00_B, 00_M, 01, 01B, 01M, 02, 02B, 02M, 10, 10B, 10M, 11, 11B, 12, 12B, 12M, 20, 20B, 20M, 21, 21B, 21M, 22, 22B, 22M]
			cubeTx.push(0.5);
			cubeTy.push(0.5);
			cubeTz.push(-1.0);
			cubeRx.push(0.0);
			cubeRy.push(0.0);
			cubeRz.push(0.0);
			cubeS.push(0.5);
		}

	}

	function drawScene() {
		// update WV matrix
		cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
		cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
		cy = lookRadius * Math.sin(utils.degToRad(-elevation));

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.useProgram(program);


		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(textLocation,0);

		var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);

		for(var ind = 0; ind < vao.length; ind++){
			worldMatrix = utils.MakeWorld(cubeTx[ind], cubeTy[ind], cubeTz[ind],cubeRx[ind], cubeRy[ind], cubeRz[ind],cubeS[ind]);
			gl.bindVertexArray(vao[ind]);
			//var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width/gl.canvas.height, 0.1, 100.0);

			var projectionMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
			var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, projectionMatrix);

			gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));


			var viewWorldMatrix = utils.multiplyMatrices(viewMatrix, cubeWorldMatrix);
			//var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

		//  gl.uniformMatrix4fv(vertexMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(viewWorldMatrix));
			var normalsMatrix = utils.invertMatrix(utils.transposeMatrix(viewWorldMatrix));
			gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalsMatrix));

			var lightPostransformed = utils.multiplyMatrixVector(viewMatrix, lightPos);
			gl.uniform3fv(lightPosLocation,  lightPostransformed.slice(0,3));

			gl.uniform3fv(materialDiffColorHandle, cubeMaterialColor);
			gl.uniform3fv(lightColorHandle,  lightColor);
			gl.uniform1f(lightTargetLocation,  lightTarget);
			gl.uniform1f(lightDecayLocation,  lightDecay);


			gl.drawElements(gl.TRIANGLES, modelIndices[ind].length, gl.UNSIGNED_SHORT, 0 );
		}
	    window.requestAnimationFrame(drawScene);
	}


}
