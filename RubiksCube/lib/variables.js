//------------------Textures constats------------
const obj_files = [
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
const texture_url = "lib/models/Rubiks Cube.png";
//-----------------------------------------------
//---------------User options Params & Functions-------------
var rotation_speed = 1.0;
var ambient_color = [0.1,0.1,0.1];
var emission_intensity = 1.0;
var cube_saved = false;
var saving_cube ={};
//application feature
function scramble(){
	for(i=0; i < 20; ++i){
		move_queue.push(Math.floor(Math.random() * 6));
	}
}
function save_cube(){
	if(changes.angle === 0.0){
		back_to_init(0.0);
		elevation_angle_restart(0.0);
		saving_cube.top = topLevelCubes;
		saving_cube.middle = middleLevelCubes;
		saving_cube.bottom = bottomLevelCubes;
		saving_cube.quaternion = new Array();
		rubik_cubes.forEach((item, i) => {
			saving_cube.quaternion.push(item.quaternion);
		});
		document.getElementById('saving_cube').innerHTML = JSON.stringify(saving_cube);
		return true;
	}
	return false;
}
//------------------------------------------------
//--------------Camera parameters-----------------
var elevation = 0.0;
var angle = 0.0;
var lookRadius = 4.1;
var last_camera = {
	angle:0.0,
	elevation: 0.0,
};
//------------------------------------------------
var map = {};// Used to understands the key pressed by users
//----------------------------Matrices used to manage cube---------------------------------
var topLevelCubes = [["22", "12", "02"],["21", "11", "01"],["20","10", "00"]];
var middleLevelCubes = [["22M", "12M", "02M"],["21M", "EMPTY", "01M"],["20M","10M", "00M"]];
var bottomLevelCubes = [["22B", "12B", "02B"],["21B", "11B", "01B"],["20B","10B", "00B"]];
//-----------------------------------------------------------------------------------------
var rubik_cubes = new Array(); //Array in which are present all the quaternion,buffers and uniforms for each model
//---------------------------Actual orientation of the model-------------------------------
var actual_axis = ["x","y","z"];
var inversion = [true,true,true];
const axis_orientations = {
	axis:[[["x","y","z"],["z","y","x"],["x","y","z"],["z","y","x"]],
	[["x","z","y"],["y","z","x"],["x","z","y"],["y","z","x"]],
	[["x","y","z"],["z","y","x"],["x","y","z"],["z","y","x"]],
	[["x","z","y"],["y","z","x"],["x","z","y"],["y","z","x"]]],
	inversion:[
		[[true,true,true],[true,true,false],[false,true,false],[false,true,true]],
		[[true,true,false],[false,true,false],[false,true,true],[true,true,true]],
		[[true,false,false],[false,false,false],[false,false,true],[true,false,true]],
		[[true,false,true],[true,false,false],[false,false,false],[false,false,true]],
	],
};
//-----------------------------------------------------------------------------------------
var changes = { //Used to manage quaternions
	rvx:0,
	rvy:1,
	rvz:0,
	angle: 0.0,
	element: new Array(),
};

//---------------------------------------------Scrambling variables----------------------------------------------
var move_queue = new Array();
var scrambling = false;
//---------------------------------------------------------------------------------------------------------------
