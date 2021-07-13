
var elevation = 0.0;
var angle = -90.0;
var map = {};
var lookRadius = 10;
var rubik_cubes = new Array();
var lastUpdateTime = (new Date).getTime();
var flag = 0;
//Cube parameters
var cubeTx = 0.0;
var cubeTy = 0.0;
var cubeTz = 0.0;
var cubeRx = 0.0;
var cubeRy = 0.0;
var cubeRz = 0.0;
var cubeS = 0.5;



async function main(){

	twgl.setDefaults({attribPrefix: "a_"});
	const m4 = twgl.m4;
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
	// get the context and attach events
	const canvas = document.getElementById("my-canvas");
	//Check that the GET was successful
	try{
		gl= canvas.getContext("webgl2");
	} catch(e){
		console.log(e);
	}
	//Program creation for the rubik element
	const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

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
				const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
				rubik_cubes.push({
					buffer:bufferInfo,
					quaternion:new Quaternion(),
					scale:1.5
				});
			}
		}

		await loadModel();
		// Shared values
		const camera = m4.identity();
		const view = m4.identity();
		const viewProjection = m4.identity();

		// a power of 2 image --> Loading texture
		const textures = twgl.createTextures(gl, {hftIcon: { src: "lib/models/Rubiks Cube.png", mag: gl.NEAREST }, });

		const objects = [];
		const drawObjects = [];
		for (let ii = 0; ii < rubik_cubes.length; ii ++) {
			let shape = rubik_cubes[ii].buffer;
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
		var worldMatrix = utils.identityMatrix();
		function animate() {
			var currentTime = (new Date).getTime();
			if (lastUpdateTime) {
				var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
				cubeRx += deltaC;
				cubeRy -= deltaC;
				cubeRz += deltaC;
				cubeS = 1.0;
			}
			worldMatrix = utils.MakeWorld(cubeTx, cubeTy, cubeTz,
				cubeRx, cubeRy, cubeRz,
				cubeS);
			lastUpdateTime = currentTime;
		}
	function render() {
		animate();
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
		var perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
		var viewMatrix = utils.MakeView(cx, cy, cz, elevation, angle);
		var projectionMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
		var projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, projectionMatrix);
		for(let i = 0; i < objects.length; i++) {
				const uni = objects[i].uniforms;
				m4.transpose(	m4.multiply(m4.multiply(worldMatrix, viewMatrix),	perspectiveMatrix),uni.u_worldViewProjection);
//				uni.u_worldViewProjection = projectionMatrix;
		}


		twgl.drawObjectList(gl, drawObjects);
    window.requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}
