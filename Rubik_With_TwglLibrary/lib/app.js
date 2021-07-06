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


var locQuaternions = new Array();

var topLevelCubes = [["22", "12", "02"],["21", "11", "01"],["20","10", "00"]];
var middleLevelCubes = [["22M", "12M", "02M"],["21M", "EMPTY", "01M"],["20M","10M", "00M"]];
var bottomLevelCubes = [["22B", "12B", "02B"],["21B", "11B", "01B"],["20B","10B", "00B"]];
var k=true;
var map = {};
var delta_rot = 1;



cubeWorldMatrix = utils.MakeWorld( 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5);

keyFunction = function(e){
    //e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';


	if (map[76]&& map[16]) {	// L
		updateLeftCCWRotation();
		displayLeftCCWRotation();

	}else if(map[76] && !map[16]){

		updateLeftCWRotation();
		displayLeftCWRotation();

	}else if (map[82] && map[16]) {	// R

		updateRightCCWRotation();
		displayRightCCWRotation();

	}else if(map[82] && !map[16]){

		updateRightCWRotation();
		displayRightCWRotation();

	}	else if (map[84] && map[16]) {	// T

		updateTopCCWRotation();
		displayTopCCWRotation();

	}else if(map[84] && !map[16]){

		updateTopCWRotation();
		displayTopCWRotation();

	}else if (map[68] && map[16]) {	// D

		updateBottomCCWRotation();
		displayBottomCCWRotation();

	}else if(map[68] && !map[16]){

		updateBottomCWRotation();
		displayBottomCWRotation();

	}else if (map[70] && map[16]) {	// F

		updateFrontCCWRotation();
		displayFrontCCWRotation();

	}else if(map[70] && !map[16]){

		updateFrontCWRotation();
		displayFrontCWRotation();

	}else if (map[66] && map[16]) {	// B

		updateBackCCWRotation();
		displayBackCCWRotation();

	}else if(map[66] && !map[16]){

		updateBackCWRotation();
		displayBackCWRotation();

	}

}

keyClear = function(e){
	map[e.keyCode] = false;
}

//'window' is a JavaScript object (if "canvas", it will not work)
window.addEventListener("keydown", keyFunction, false);
window.addEventListener("keyup", keyClear, false);

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
	let topTmp = [topLevelCubes[0][2], topLevelCubes[1][2], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[0][2], middleLevelCubes[1][2], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[0][2], bottomLevelCubes[1][2], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][2] = localMatrix[i][2]+"";
		middleLevelCubes[i][2] = localMatrix[i][1]+"";
		bottomLevelCubes[i][2] = localMatrix[i][0]+"";
	}
	console.log("Right CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateRightCCWRotation(){
	let topTmp = [topLevelCubes[0][2], topLevelCubes[1][2], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[0][2], middleLevelCubes[1][2], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[0][2], bottomLevelCubes[1][2], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][2] = localMatrix[2-i][0]+"";
		middleLevelCubes[i][2] = localMatrix[2-i][1]+"";
			bottomLevelCubes[i][2] = localMatrix[2-i][2]+"";
	}
	console.log("Right CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateLeftCWRotation(){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[1][0], topLevelCubes[2][0]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[1][0], middleLevelCubes[2][0]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[1][0], bottomLevelCubes[2][0]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){

		topLevelCubes[i][0] = localMatrix[i][2]+"";
		middleLevelCubes[i][0] = localMatrix[i][1]+"";
		bottomLevelCubes[i][0] = localMatrix[i][0]+"";
	}
	console.log("Left CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateLeftCCWRotation(){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[1][0], topLevelCubes[2][0]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[1][0], middleLevelCubes[2][0]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[1][0], bottomLevelCubes[2][0]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][0] = localMatrix[2-i][0];
		middleLevelCubes[i][0] = localMatrix[2-i][1];
		bottomLevelCubes[i][0] = localMatrix[2-i][2];
	}
	console.log("Left CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateTopCCWRotation(){
	let row1 = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let row2 = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let row3 = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;
	let localMatrix = [row1, row2, row3];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][0] = localMatrix[0][2-i]+"";
		topLevelCubes[i][1] = localMatrix[1][2-i]+"";
		topLevelCubes[i][2] = localMatrix[2][2-i]+"";
	}
	console.log("Top CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateTopCWRotation(){
	let row1 = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let row2 = [topLevelCubes[1][0], topLevelCubes[1][1], topLevelCubes[1][2]] ;
	let row3 = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;

	let localMatrix = [row1, row2, row3];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[i][0] = localMatrix[2][i]+"";
		topLevelCubes[i][1] = localMatrix[1][i]+"";
		topLevelCubes[i][2] = localMatrix[0][i]+"";
	}
	console.log("Top CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateBottomCCWRotation(){

	let row1 = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let row2 = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let row3 = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [row1, row2, row3];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){

		bottomLevelCubes[i][0] = localMatrix[0][2-i]+"";
		bottomLevelCubes[i][1] = localMatrix[1][2-i]+"";
		bottomLevelCubes[i][2] = localMatrix[2][2-i]+"";
	}
	console.log("Bottom CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateBottomCWRotation(){
	let row1 = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let row2 = [bottomLevelCubes[1][0], bottomLevelCubes[1][1], bottomLevelCubes[1][2]] ;
	let row3 = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [row1, row2, row3];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		bottomLevelCubes[i][0] = localMatrix[2][i]+"";
		bottomLevelCubes[i][1] = localMatrix[1][i]+"";
		bottomLevelCubes[i][2] = localMatrix[0][i]+"";
	}
	console.log("Bottom CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
	console.log("---------------------------");
}

function updateFrontCWRotation(){
	let topTmp = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[2][0], middleLevelCubes[2][1], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);

	for(var i = 0; i < 3; i++){
		topLevelCubes[2][i] = localMatrix[2-i][0]+"";
		middleLevelCubes[2][i] = localMatrix[2-i][1]+"";
		bottomLevelCubes[2][i] = localMatrix[2-i][2]+"";
	}
	console.log("Front CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
}

function updateFrontCCWRotation(){
	let topTmp = [topLevelCubes[2][0], topLevelCubes[2][1], topLevelCubes[2][2]] ;
	let middleTmp = [middleLevelCubes[2][0], middleLevelCubes[2][1], middleLevelCubes[2][2]] ;
	let bottomTmp = [bottomLevelCubes[2][0], bottomLevelCubes[2][1], bottomLevelCubes[2][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){

		topLevelCubes[2][i] = localMatrix[i][2]+"";
		middleLevelCubes[2][i] = localMatrix[i][1]+"";
		bottomLevelCubes[2][i] = localMatrix[i][0]+"";
	}
	console.log("Front CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
}

function updateBackCWRotation(){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[0][1], middleLevelCubes[0][2]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];

	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[0][i] = localMatrix[2-i][0]+"";
		middleLevelCubes[0][i] = localMatrix[2-i][1]+"";
		bottomLevelCubes[0][i] = localMatrix[2-i][2]+"";
	}
	console.log("Back CW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
	console.log(bottomLevelCubes);
}

function updateBackCCWRotation(){
	let topTmp = [topLevelCubes[0][0], topLevelCubes[0][1], topLevelCubes[0][2]] ;
	let middleTmp = [middleLevelCubes[0][0], middleLevelCubes[0][1], middleLevelCubes[0][2]] ;
	let bottomTmp = [bottomLevelCubes[0][0], bottomLevelCubes[0][1], bottomLevelCubes[0][2]] ;
	let localMatrix = [topTmp,middleTmp, bottomTmp];
	console.log("Local Matrix:");
	console.log(localMatrix);
	for(var i = 0; i < 3; i++){
		topLevelCubes[0][i] = localMatrix[i][2]+"";
		middleLevelCubes[0][i] = localMatrix[i][1]+"";
		bottomLevelCubes[0][i] = localMatrix[i][0]+"";
	}
	console.log("Back CCW Rotation");
	console.log(topLevelCubes);
	console.log(middleLevelCubes);
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


function displayRightCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRy[mapValueToArrayIndex(topLevelCubes[i][2])] += 90 ;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][2])]  += 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][2])] += 90;*/
		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(topLevelCubes[i][2]));
		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(middleLevelCubes[i][2]));
		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(bottomLevelCubes[i][2]));
	}
}

function displayRightCWRotation(){
	let total = 90;
	for(let i = 0; i < 3; i++){

		/*cubeRy[mapValueToArrayIndex(topLevelCubes[i][2])] = (cubeRy[mapValueToArrayIndex(topLevelCubes[i][2])] - 90) % 360;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][2])] = (cubeRy[mapValueToArrayIndex(middleLevelCubes[i][2])] - 90) % 360;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][2])] = (cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][2])] - 90) % 360;*/

		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(topLevelCubes[i][2]));
		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(middleLevelCubes[i][2]));
		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(bottomLevelCubes[i][2]));

	}
}

function displayLeftCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRy[mapValueToArrayIndex(topLevelCubes[i][0])] -= 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][0])]  -= 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][0])] -= 90;*/

		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(topLevelCubes[i][0]));
		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(middleLevelCubes[i][0]));
		updateWorld(1, 0, 0, +90, mapValueToArrayIndex(bottomLevelCubes[i][0]));
	}
}

function displayLeftCWRotation(){

	for(let i = 0; i < 3; i++){
		/*cubeRy[mapValueToArrayIndex(topLevelCubes[i][0])] += 90;
		cubeRy[mapValueToArrayIndex(middleLevelCubes[i][0])]  += 90;
		cubeRy[mapValueToArrayIndex(bottomLevelCubes[i][0])] += 90;*/

		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(topLevelCubes[i][0]));
		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(middleLevelCubes[i][0]));
		updateWorld(1, 0, 0, -90, mapValueToArrayIndex(bottomLevelCubes[i][0]));
	}
}

function displayTopCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRx[mapValueToArrayIndex(topLevelCubes[i][0])] -= 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][1])] -= 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][2])] -= 90;*/

		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(topLevelCubes[i][0]));
		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(topLevelCubes[i][1]));
		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(topLevelCubes[i][2]));
	}
}

function displayTopCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRx[mapValueToArrayIndex(topLevelCubes[i][0])] += 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][1])] += 90;
		cubeRx[mapValueToArrayIndex(topLevelCubes[i][2])] += 90;*/

		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(topLevelCubes[i][0]));
		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(topLevelCubes[i][1]));
		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(topLevelCubes[i][2]));
	}
}

function displayBottomCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][0])] -= 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][1])] -= 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][2])] -= 90;*/

		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(bottomLevelCubes[i][0]));
		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(bottomLevelCubes[i][1]));
		updateWorld(0, 1, 0, +90, mapValueToArrayIndex(bottomLevelCubes[i][2]));
	}
}

function displayBottomCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][0])] += 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][1])] += 90;
		cubeRx[mapValueToArrayIndex(bottomLevelCubes[i][2])] += 90;*/

		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(bottomLevelCubes[i][0]));
		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(bottomLevelCubes[i][1]));
		updateWorld(0, 1, 0, -90, mapValueToArrayIndex(bottomLevelCubes[i][2]));
	}
}

function displayFrontCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRz[mapValueToArrayIndex(topLevelCubes[2][i])] -= 90;
		cubeRz[mapValueToArrayIndex(middleLevelCubes[2][i])]  -= 90;
		cubeRz[mapValueToArrayIndex(bottomLevelCubes[2][i])] -= 90;*/

		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(topLevelCubes[2][i]));
		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(middleLevelCubes[2][i]));
		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(bottomLevelCubes[2][i]));

	}
}

function displayFrontCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRz[mapValueToArrayIndex(topLevelCubes[2][i])] += 90;
		cubeRz[mapValueToArrayIndex(middleLevelCubes[2][i])]  += 90;
		cubeRz[mapValueToArrayIndex(bottomLevelCubes[2][i])] += 90;*/

		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(topLevelCubes[2][i]));
		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(middleLevelCubes[2][i]));
		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(bottomLevelCubes[2][i]));
	}
}


function displayBackCCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRz[mapValueToArrayIndex(topLevelCubes[0][i])] -= 90;
		cubeRz[mapValueToArrayIndex(middleLevelCubes[0][i])]  -= 90;
		cubeRz[mapValueToArrayIndex(bottomLevelCubes[0][i])] -= 90;*/

		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(topLevelCubes[0][i]));
		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(middleLevelCubes[0][i]));
		updateWorld(0, 0, 1, +90, mapValueToArrayIndex(bottomLevelCubes[0][i]));
	}
}

function displayBackCWRotation(){
	for(let i = 0; i < 3; i++){
		/*cubeRz[mapValueToArrayIndex(topLevelCubes[0][i])] += 90;
		cubeRz[mapValueToArrayIndex(middleLevelCubes[0][i])]  += 90;
		cubeRz[mapValueToArrayIndex(bottomLevelCubes[0][i])] += 90;*/

		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(topLevelCubes[0][i]));
		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(middleLevelCubes[0][i]));
		updateWorld(0, 0, 1, -90, mapValueToArrayIndex(bottomLevelCubes[0][i]));
	}
}


async function main(){
	twgl.setDefaults({attribPrefix: "a_"});
	const m4 = twgl.m4;
	var k = true;
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
	//Program creation for the rubik element
	const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

	async function loadModel(){
			k = false;
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
				const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
				shapes.push(bufferInfo);
				cubeTx.push(0.0);	cubeTy.push(0.0);	cubeTz.push(0.0);
				cubeRx.push(0.0);	cubeRy.push(0.0);	cubeRz.push(0.0);
				cubeS.push(0.5);
				locQuaternions.push(new Quaternion());
			}
			return shapes;
		}

		const shapes = await loadModel();
		// Shared values
		const camera = m4.identity();
		const view = m4.identity();
		const viewProjection = m4.identity();

		// a power of 2 image --> Loading texture
		const textures = twgl.createTextures(gl, {hftIcon: { src: "lib/models/Rubiks Cube.png", mag: gl.NEAREST }, });

		const objects = [];
		const drawObjects = [];
		for (let ii = 0; ii < shapes.length; ii ++) {
			let shape = shapes[ii];
			let uniforms = {
					//  u_diffuseMult: [0.6901960784313725, 0.7372549019607844, 0.3411764705882353, 1],
						u_diffuse: textures.hftIcon,
						u_viewInverse: camera,
						u_world: m4.identity(),
						u_worldInverseTranspose: m4.identity(),
						u_worldViewProjection: m4.identity(),
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

	function render() {
		twgl.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// update WV matrix
		cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
		cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
		cy = lookRadius * Math.sin(utils.degToRad(-elevation));

		perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
		var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
		for(let i = 0; i < objects.length; i++) {
			const uni = objects[i].uniforms;
			worldMatrix = utils.multiplyMatrices(locQuaternions[i].toMatrix4(false), utils.MakeScaleMatrix(cubeS[i]));
			var projectionMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
			var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, projectionMatrix);
			m4.transpose(projectionMatrix,uni.u_worldViewProjection);
		}
		twgl.drawObjectList(gl, drawObjects);
    window.requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

function updateWorld(rvx, rvy, rvz, deltaDeg, index) {
	var deltaRad = utils.degToRad(deltaDeg);
	var deltaQuaternion = new Quaternion(Math.cos(deltaRad/2), Math.sin(deltaRad/2)*rvx, Math.sin(deltaRad/2)*rvy, Math.sin(deltaRad/2)*rvz);
	inv = new Quaternion();
	appl = new Quaternion();
	locQuaternions[index] = deltaQuaternion.mul(locQuaternions[index]);
}
