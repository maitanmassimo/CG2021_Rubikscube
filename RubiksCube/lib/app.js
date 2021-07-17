var matrix_moves = new Array(updateBackRotation, updateTopRotation, updateLeftRotation, updateFrontRotation, updateRightRotation, updateBottomRotation);
var display_moves = new Array(displayBackRotation, displayTopRotation, displayLeftRotation, displayFrontRotation, displayRightRotation, displayBottomRotation);
//Brings the matrices to the initial configuration(green face in front of the user)
function back_to_init(new_elevation){
	for(let i = 0; i < (last_camera.elevation/90); i++)	{
		updateXCentreRotation(true);
		updateRightRotation(true);
		updateLeftRotation(true);
	}
	for(let i = 0; i < (last_camera.angle/90); i++){
		updateYCentreRotation(false);
		updateTopRotation(false);
		updateBottomRotation(false);
	}
	last_camera.angle = 0.0;

	for(let i = 0; i < (new_elevation/90); i++)	{
		updateXCentreRotation(false);
		updateRightRotation(false);
		updateLeftRotation(false);
	}
}
function elevation_angle_restart(ele){
	for(let i = 0; i < (last_camera.angle/90); i++){
		if(ele == 0.0 || ele == 180.0){
			updateYCentreRotation((ele == 0.0) ? false : true);
			updateTopRotation((ele == 0.0) ? false : true);
			updateBottomRotation((ele == 0.0) ? false : true);
		}else{
			updateZCentreRotation((ele == 90.0) ? false : true);
			updateBackRotation((ele == 90.0) ? false : true);
			updateFrontRotation((ele == 90.0) ? false : true);
		}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------
//Manage the matrices in order to reflect the cube movement and allows the user to press the key regardless of what rotation the cube has made
function elevation_angle_rotation(ele,angle){
	for(let i = 0; i < (angle/90); i++){
		if(ele == 0.0 || ele == 180.0){
			updateYCentreRotation((ele == 0.0) ? true : false);
			updateTopRotation((ele == 0.0) ? true : false);
			updateBottomRotation((ele == 0.0) ? true : false);
		}else{
			updateZCentreRotation((ele == 90.0) ? true : false);
			updateBackRotation((ele == 90.0) ? true : false);
			updateFrontRotation((ele == 90.0) ? true : false);
		}
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------
function elevation_mapping(){
	//--------------------------------------------elevation = 0-------------------------------------------------
	if(((elevation <= 0 && elevation >= -45)|| elevation <=-315) || ( (elevation > 0 && elevation <=45) || elevation >= 315)){return 0.0;}
	//----------------------------------------------------------------------------------------------------------
	//-----------------------------------------elevation = -90--------------------------------------------------
	if((elevation < -45 && elevation >= -135) || (elevation < 315 && elevation > 225)){return 90.0;}
	//----------------------------------------------------------------------------------------------------------
	//-----------------------------------------------elevation = -180/-180--------------------------------------
	if((elevation < -135 && elevation >= -225) || (elevation <= 225 && elevation > 135)){return 180.0;}
	//----------------------------------------------------------------------------------------------------------
	//---------------------------------------------elevation = -270---------------------------------------------
	if((elevation < -225 && elevation > -315) || (elevation <= 135 && elevation > 45)){return 270.0}
	//----------------------------------------------------------------------------------------------------------
}
function angle_mapping(){
	//--------------------------------------------angle = 0-----------------------------------------------------
	if(((angle <= 0 && angle >= -45 )|| angle <=- 315) || ((angle <= 45 && angle >=0)||(angle>315))){return 0.0;}
	//----------------------------------------------------------------------------------------------------------
	//--------------------------------------------angle = 90----------------------------------------------------
	if((angle <= 315 && angle >225) || (angle < -45 && angle >=- 135)){return 90.0;}
	//----------------------------------------------------------------------------------------------------------
	//--------------------------------------------angle = 180---------------------------------------------------
	if((angle <= 225 && angle >=135) || (angle < -135 && angle >=- 225)){return 180.0;}
	//----------------------------------------------------------------------------------------------------------
	//--------------------------------------------angle = 270---------------------------------------------------
	if((angle > 45 && angle < 135) || (angle < -225 && angle >=-315)){return 270.0;}
	//----------------------------------------------------------------------------------------------------------
}
//--------------Rotates the matrices in order to reflect the actual view-----------------
function uniform_keyboard(){
	if(!scrambling){
		var new_angle = angle_mapping();
		var new_elevation = elevation_mapping();
		if(last_camera.elevation != new_elevation){
			back_to_init(new_elevation);
		}
		actual_axis =axis_orientations.axis[new_elevation/90][new_angle/90];
		inversion = axis_orientations.inversion[new_elevation/90][new_angle/90];
		if(last_camera.angle != new_angle){
			elevation_angle_restart(new_elevation);
			elevation_angle_rotation(new_elevation, new_angle);
		}
		last_camera.angle =  new_angle;
		last_camera.elevation = new_elevation;
	}
}
//---------------------------------------------------------------------------------------
//------------------------Map the key events and which move it has to do----------
keyFunction = function(e){
    //e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
	if (map[76]&& map[16] && changes.angle == 0) {	// L
		updateLeftRotation(false);
		displayLeftRotation(+90);
	}else if(map[76] && !map[16] && changes.angle == 0){
		updateLeftRotation(true);
		displayLeftRotation(-90);
	}else if (map[82] && map[16] && changes.angle == 0) {	// R
		updateRightRotation(false);
		displayRightRotation(+90);
	}else if(map[82] && !map[16] && changes.angle == 0){
		updateRightRotation(true);
		displayRightRotation(-90);
	}	else if (map[84] && map[16] && changes.angle == 0) {	// T
		updateTopRotation(false);
		displayTopRotation(+90);
	}else if(map[84] && !map[16] && changes.angle == 0){
		updateTopRotation(true);
		displayTopRotation(-90);
	}else if (map[68] && map[16] && changes.angle == 0) {	// D
		updateBottomRotation(false);
		displayBottomRotation(+90);
	}else if(map[68] && !map[16] && changes.angle == 0){
		updateBottomRotation(true);
		displayBottomRotation(-90);
	}else if (map[70] && map[16] && changes.angle == 0) {	// F
		updateFrontRotation(false);
		displayFrontRotation(+90);
	}else if(map[70] && !map[16] && changes.angle == 0){
		updateFrontRotation(true);
		displayFrontRotation(-90);
	}else if (map[66] && map[16] && changes.angle == 0) {	// B
		updateBackRotation(false);
		displayBackRotation(+90);
	}else if(map[66] && !map[16] && changes.angle == 0){
		updateBackRotation(true);
		displayBackRotation(-90);
	}
}
keyClear = function(e){
	map[e.keyCode] = false;
}
//---------------------------------------------------------------------------------------------------------------------------------------------
window.addEventListener("keydown", keyFunction, false);
window.addEventListener("keyup", keyClear, false);
// event handler
var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
//-----------Mouse events----------------
function doMouseDown(event) {
	lastMouseX = event.pageX;
	lastMouseY = event.pageY;
	mouseState = true;
}
function doMouseUp(event) {
	lastMouseX = -100;
	lastMouseY = -100;
	mouseState = false;
}
function doMouseMove(event) {

	if(mouseState) {
		var dx = event.pageX - lastMouseX;
		var dy = lastMouseY - event.pageY;
		lastMouseX = event.pageX;
		lastMouseY = event.pageY;

		if((dx != 0) || (dy != 0)) {
			elevation =( elevation + 0.25 * dy)%360;
			if((elevation > 135 && elevation < 315 )|| (elevation < -90 && elevation > -270 )){
				angle = (angle - 0.25 * dx)%360;

			}else{angle = (angle + 0.25 * dx)%360;
			}
		}
		uniform_keyboard();

}
}
function doMouseWheel(event) {
	var nLookRadius = lookRadius + event.wheelDelta/1000.0;
	if((nLookRadius > 3.1) && (nLookRadius < 20.0)) {
		lookRadius = nLookRadius;
	}
}
//--------------------------------------
//-----------------------------------Functions used to rotate in the right way the matrices-------------------------------------------------
function updateXCentreRotation(cw){
	let topTmp = [topLevelCubes[0][1], topLevelCubes[1][1], topLevelCubes[2][1]] ;
	let middleTmp = [middleLevelCubes[0][1], middleLevelCubes[1][1], middleLevelCubes[2][1]] ;
	let bottomTmp = [bottomLevelCubes[0][1], bottomLevelCubes[1][1], bottomLevelCubes[2][1]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][1] = (cw) ? localMatrix[i][2]+"" :  localMatrix[2-i][0]+"";
		middleLevelCubes[i][1] = (cw) ? localMatrix[i][1]+"" : localMatrix[2-i][1]+"";
		bottomLevelCubes[i][1] = (cw) ? localMatrix[i][0]+"" : localMatrix[2-i][2]+"";
	}
}

function updateYCentreRotation(cw){
	let row1 = [middleLevelCubes[0][0], middleLevelCubes[0][1], middleLevelCubes[0][2]] ;
	let row2 = [middleLevelCubes[1][0], middleLevelCubes[1][1], middleLevelCubes[1][2]] ;
	let row3 = [middleLevelCubes[2][0], middleLevelCubes[2][1], middleLevelCubes[2][2]] ;
	let localMatrix = [row1, row2, row3];
	for(var i = 0; i < 3; i++){
		middleLevelCubes[i][0] = (cw) ? localMatrix[2][i]+"" : localMatrix[0][2-i]+"";
		middleLevelCubes[i][1] = (cw) ? localMatrix[1][i]+"" : localMatrix[1][2-i]+"";
		middleLevelCubes[i][2] = (cw) ? localMatrix[0][i]+"" : localMatrix[2][2-i]+"";
	}
}

function updateZCentreRotation(cw){
	let topTmp = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let middleTmp = [middleLevelCubes[1][0], middleLevelCubes[1][1], middleLevelCubes[1][2]] ;
	let bottomTmp = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[1][i] = (cw) ? localMatrix[2-i][0]+"" :  localMatrix[i][2]+"";
		middleLevelCubes[1][i] = (cw) ? localMatrix[2-i][1]+"" : localMatrix[i][1]+"";
		bottomLevelCubes[1][i] = (cw) ? localMatrix[2-i][2]+"" : localMatrix[i][0]+"";
	}
}

function updateRightRotation(cw){
	let topTmp = [topLevelCubes[0][2], topLevelCubes[1][2], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[0][2], middleLevelCubes[1][2], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[0][2], bottomLevelCubes[1][2], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][2] = (cw) ? localMatrix[i][2]+"" :  localMatrix[2-i][0]+"";
		middleLevelCubes[i][2] = (cw) ? localMatrix[i][1]+"" : localMatrix[2-i][1]+"";
		bottomLevelCubes[i][2] = (cw) ? localMatrix[i][0]+"" : localMatrix[2-i][2]+"";
	}
}

function updateLeftRotation(cw){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[1][0], topLevelCubes[2][0]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[1][0], middleLevelCubes[2][0]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[1][0], bottomLevelCubes[2][0]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][0] = (cw) ? localMatrix[i][2]+"" : localMatrix[2-i][0];
		middleLevelCubes[i][0] = (cw) ? localMatrix[i][1]+"" : localMatrix[2-i][1];
		bottomLevelCubes[i][0] = (cw) ? localMatrix[i][0]+"" : localMatrix[2-i][2] ;
	}
}

function updateFrontRotation(cw){
	let topTmp = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[2][0], middleLevelCubes[2][1], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[2][i] = (cw) ? localMatrix[2-i][0]+"" : localMatrix[i][2]+"";
		middleLevelCubes[2][i] = (cw) ? localMatrix[2-i][1]+"" : localMatrix[i][1]+"";
		bottomLevelCubes[2][i] = (cw) ? localMatrix[2-i][2]+"" : localMatrix[i][0]+"";
	}
}

function updateBackRotation(cw){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[0][1], middleLevelCubes[0][2]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	for(var i = 0; i < 3; i++){
		topLevelCubes[0][i] = (cw) ? localMatrix[2-i][0]+"" :  localMatrix[i][2]+"";
		middleLevelCubes[0][i] = (cw) ? localMatrix[2-i][1]+"" : localMatrix[i][1]+"";
		bottomLevelCubes[0][i] = (cw) ? localMatrix[2-i][2]+"" : localMatrix[i][0]+"";
	}
}

function updateTopRotation(cw){
	let row1 = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let row2 = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let row3 = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;

	let localMatrix = [row1, row2, row3];
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][0] = (cw) ? localMatrix[2][i]+"" : localMatrix[0][2-i]+"";
		topLevelCubes[i][1] = (cw) ? localMatrix[1][i]+"" : localMatrix[1][2-i]+"";
		topLevelCubes[i][2] = (cw) ? localMatrix[0][i]+"" : localMatrix[2][2-i]+"";
	}
}

function updateBottomRotation(cw){
	let row1 = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let row2 = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let row3 = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [row1, row2, row3];
	for(var i = 0; i < 3; i++){
		bottomLevelCubes[i][0] = (cw) ? localMatrix[2][i]+"" : localMatrix[0][2-i]+"";
		bottomLevelCubes[i][1] = (cw) ? localMatrix[1][i]+"" : localMatrix[1][2-i]+"";
		bottomLevelCubes[i][2] = (cw) ? localMatrix[0][i]+"" : localMatrix[2][2-i]+"";
	}
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

function displayRightRotation(angle){
changes = {
	rvx:(actual_axis[0] == "x") ? (inversion[0]) ? 1 : -1 : 0,
	rvy:(actual_axis[1] == "x") ? (inversion[1]) ? 1 : -1 : 0,
	rvz:(actual_axis[2] == "x") ? (inversion[2]) ? 1 : -1 : 0,
	angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(
			mapValueToArrayIndex(topLevelCubes[i][2]),
			mapValueToArrayIndex(middleLevelCubes[i][2]),
			mapValueToArrayIndex(bottomLevelCubes[i][2]));
	}
}

function displayLeftRotation(angle){
	changes = {
		rvx:(actual_axis[0] == "x") ? (inversion[0]) ? 1 : -1 : 0,
		rvy:(actual_axis[1] == "x") ? (inversion[1]) ? 1 : -1 : 0,
		rvz:(actual_axis[2] == "x") ? (inversion[2]) ? 1 : -1 : 0, angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(
			mapValueToArrayIndex(topLevelCubes[i][0]),
			mapValueToArrayIndex(middleLevelCubes[i][0]),
			mapValueToArrayIndex(bottomLevelCubes[i][0]));
	}
}

function displayTopRotation(angle){
	changes = {
		rvx:(actual_axis[0] == "y") ? (inversion[0]) ? 1 : -1 : 0,
		rvy:(actual_axis[1] == "y") ? (inversion[1]) ? 1 : -1 : 0,
		rvz:(actual_axis[2] == "y") ? (inversion[2]) ? 1 : -1 : 0,
		angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(
			mapValueToArrayIndex(topLevelCubes[i][0]),
			mapValueToArrayIndex(topLevelCubes[i][1]),
			mapValueToArrayIndex(topLevelCubes[i][2]));
	}
}

function displayBottomRotation(angle){
	changes = {
		rvx:(actual_axis[0] == "y") ? (inversion[0]) ? 1 : -1 : 0,
		rvy:(actual_axis[1] == "y") ? (inversion[1]) ? 1 : -1 : 0,
		rvz:(actual_axis[2] == "y") ? (inversion[2]) ? 1 : -1 : 0,
		angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(
			mapValueToArrayIndex(bottomLevelCubes[i][0]),
		mapValueToArrayIndex(bottomLevelCubes[i][1]),
		mapValueToArrayIndex(bottomLevelCubes[i][2]));
	}
}

function displayFrontRotation(angle){
	changes = {
		rvx:(actual_axis[0] == "z") ? (inversion[0]) ? 1 : -1 : 0,
		rvy:(actual_axis[1] == "z") ? (inversion[1]) ? 1 : -1 : 0,
		rvz:(actual_axis[2] == "z") ? (inversion[2]) ? 1 : -1 : 0,
		angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(
			mapValueToArrayIndex(topLevelCubes[2][i]),
			mapValueToArrayIndex(middleLevelCubes[2][i]),
			mapValueToArrayIndex(bottomLevelCubes[2][i]));
	}
}

function displayBackRotation(angle){
	changes = {
		rvx:(actual_axis[0] == "z") ? (inversion[0]) ? 1 : -1 : 0,
		rvy:(actual_axis[1] == "z") ? (inversion[1]) ? 1 : -1 : 0,
		rvz:(actual_axis[2] == "z") ? (inversion[2]) ? 1 : -1 : 0,
		angle: angle, element: new Array(),}
	for(let i = 0; i < 3; i++){
		changes.element.push(mapValueToArrayIndex(topLevelCubes[0][i]),
		mapValueToArrayIndex(middleLevelCubes[0][i]),
		mapValueToArrayIndex(bottomLevelCubes[0][i]));
	}
}
//---------------------------------------------------------------------------------------------------------------------------------------------

async function main(saving,rotation_speed_from_user,ambient_color_from_user,light_position_from_user,light_color_from_user){
	console.log(light_position_from_user);
	console.log(light_color_from_user);
//__________________________________________________________INITIALIZATION PHASE_______________________________________________________________
	twgl.setDefaults({attribPrefix: "a_"});
	const m4 = twgl.m4;
	//------------Setup of the user parameters--------------
	rotation_speed = parseInt(rotation_speed_from_user);
	function rotation_speed_normalize(){
		switch (rotation_speed) {
			case 1: rotation_speed = 0.1;	break;
			case 2: rotation_speed = 0.2;	break;
			case 3: rotation_speed = 0.5;	break;
			case 4: rotation_speed = 1;	break;
			case 5: rotation_speed = 2;	break;
			case 6: rotation_speed = 5;	break;
			case 7: rotation_speed = 10;	break;
		}
	}
	rotation_speed_normalize();
	ambient_color = ambient_color_from_user;
	//-----------------------------------------------------
	// get the context and attach events
	const canvas = document.getElementById("my-canvas");
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
	//Program creation for the rubik element and vertex/fragment shaders attachment
	const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
	//Loading of the model and buffers creations
	async function loadModel(){
			var shapes = new Array();
			for(var ind = 0; ind < obj_files.length; ind ++ ){
				// Load mesh using the webgl-obj-loader library
				var objStr = await utils.get_objstr("lib/models/" + obj_files[ind] + ".obj");
				var objModel = new OBJ.Mesh(objStr);
				const arrays = {
					position: objModel.vertices,
					normal: objModel.vertexNormals,
					texcoord: objModel.textures,
					indices: objModel.indices
				};
				//Buffer creation using twgl library
				const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
				rubik_cubes.push({
					buffer:bufferInfo,
					quaternion:new Quaternion(),
					scale:0.5
				});
			}
		}
	//Load mesh in await mode in order to get the full canvas when all the meshes are loaded
	await loadModel();
	//A power of 2 image --> Loading texture
	const textures = twgl.createTextures(gl, {hftIcon: { src: "lib/models/Rubiks Cube.png", mag: gl.NEAREST }, });
	const objects = []; //Used to control the uniforms in the shaders
	const drawObjects = []; // Used to pass the vertex and buffers to webgl
	for (let ii = 0; ii < rubik_cubes.length; ii ++) {
		let shape = rubik_cubes[ii].buffer; // Assign the right buffer
		//Setting up all the initial matrices used in the uniforms
		let uniforms = {
					u_diffuse: textures.hftIcon,
					u_viewInverse:  m4.identity(),
					u_world: m4.identity(),
					u_worldInverseTranspose: m4.identity(),
					u_worldViewProjection: m4.identity(),
					cameraLookAt: m4.identity(),
					cameraProjection: m4.identity(),
					meshTransform: m4.identity(),
					modelMatrix: m4.identity(),
					meshTransformTransposedInverse: m4.identity(),
					u_pointLightColor: [light_color_from_user[0]/255, light_color_from_user[1]/255, light_color_from_user[2]/255.0],
					u_pointLightPos: [parseInt(light_position_from_user[0]),parseInt(light_position_from_user[1]),parseInt(light_position_from_user[2])],
				};
		drawObjects.push({
			programInfo: programInfo,
			bufferInfo: shape,
			uniforms: uniforms,
		});
		objects.push({
			uniforms: uniforms,
		});
	}
	//---------------If there is an old game, it is restored------------------------
	if(saving != ''){
		topLevelCubes = saving.top;
		middleLevelCubes = saving.middle;
		bottomLevelCubes = saving.bottom;
		rubik_cubes.forEach((item, i) => {
			console.log(saving.quaternion[i]);
			item.quaternion = new Quaternion(saving.quaternion[i]);
		});
			saving = '';
	}
	//------------------------------------------------------------------------------
//___________________________________________________________________________________________________________________________________________________________________________
//______________________________________________________________DRAW CALL____________________________________________________________________________________________________
	//-----------------Function used to calculate the rotation matrices for each model using quaternions-----------------------
	function updateWorld(rvx, rvy, rvz, deltaDeg, index) {
			var deltaRad = utils.degToRad(deltaDeg);
			var deltaQuaternion = new Quaternion(Math.cos(deltaRad/2), Math.sin(deltaRad/2)*rvx, Math.sin(deltaRad/2)*rvy, Math.sin(deltaRad/2)*rvz);
			rubik_cubes[index].quaternion = deltaQuaternion.mul(rubik_cubes[index].quaternion);
	}
	//------------------------------------------------------------------------------------------------------------------------
	function render() {
		//-------------------------------------------------Update World Call----------------------------------------------------
		if(changes.angle != 0){
			for(let i = 0; i < changes.element.length;i++){
				if(changes.angle > 0){
					updateWorld(changes.rvx, changes.rvy, changes.rvz, 9 * rotation_speed, changes.element[i] );
					changes.angle = parseFloat((changes.angle - rotation_speed).toFixed(2));
				}else if(changes.angle < 0){
					updateWorld(changes.rvx, changes.rvy, changes.rvz, -9 * rotation_speed, changes.element[i] );
					changes.angle = parseFloat((changes.angle + rotation_speed).toFixed(2));
				}
			}
		}
		//---------------------------------------------------------------------------------------------------------------------
		//------------------------------------------Checking scramble moves prioirty-------------------------------------------
		if(changes.angle === 0 && move_queue.length != 0){
			scrambling = true;
			var rand = move_queue.pop();
			matrix_moves[rand](true);
			display_moves[rand](-90);
			if(move_queue.length === 0){
				scrambling = false;
				uniform_keyboard();
			}
		}
		//---------------------------------------------------------------------------------------------------------------------
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// update WV matrix
		cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
		cy = lookRadius * Math.sin(utils.degToRad(-elevation));
		cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));

		const perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.5, 100.0);
		var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
		//Update all the models uniforms
		for(let i = 0; i < objects.length; i++) {
			const uni = objects[i].uniforms;
			//Model Matrix
			uni.modelMatrix = utils.multiplyMatrices(rubik_cubes[i].quaternion.toMatrix4(false), utils.MakeScaleMatrix(rubik_cubes[i].scale));
			//Normal Matrix
			var t_matrix = utils.transposeMatrix(uni.modelMatrix);
			uni.u_worldInverseTranspose = utils.transposeMatrix(utils.invertMatrix(t_matrix));
			//VM Mtarix
			var matrix_view = utils.multiplyMatrices(viewMatrix , uni.modelMatrix);
			uni.u_worldViewProjection = utils.transposeMatrix(utils.multiplyMatrices(perspectiveMatrix , matrix_view));
			//Uniform assignment
			uni.u_worldMatrix = t_matrix;
			uni.cam_pos = [cx, cy, cz];
			uni.emission_intensity = emission_intensity;
			uni.ambient_color = [ambient_color[0]/255, ambient_color[1]/255, ambient_color[2]/255.0];
			uni.u_inv_matrix_view = (utils.transposeMatrix(utils.invertMatrix(viewMatrix)));
		}
		//Webgl buffers pass
		twgl.drawObjectList(gl, drawObjects);
		window.requestAnimationFrame(render);
	}
//___________________________________________________________________________________________________________________________________________________________________________
	requestAnimationFrame(render);
}
