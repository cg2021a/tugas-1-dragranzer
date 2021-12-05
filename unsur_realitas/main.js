import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/FBXLoader.js";

let scene, camera, renderer, sphere, target, texture, controls, textured;
var cubeCamera2, cubeRenderTarget;

function makeInstance(geometry, color, x) {
const material = new THREE.MeshPhongMaterial({ color });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cube.position.x = x;

return cube;
}

function makeTextured(geometry, img, x) {
texture = new THREE.TextureLoader().load(img);

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
});
const spherical = new THREE.Mesh(geometry, material);
scene.add(spherical);

spherical.position.x = x;

return spherical;
}


let createGeometry = function () {
texture = new THREE.TextureLoader().load("img/pic18.jpg");

let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
});

let geometry = new THREE.SphereGeometry(50, 100, 100);

sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);
};

let init = function () {
// create the scene
scene = new THREE.Scene();
const near = 35;
const far = 100;
const color = 'lightblue';
scene.fog = new THREE.Fog(color, near, far);
scene.background = new THREE.Color(color);
const light = new THREE.DirectionalLight("white", 1);
light.castShadow = true;
light.position.set(20, 30, 10);
scene.add(light);

const floorMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("./img/jalan.jpg"),
});


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 100, 100),
    floorMaterial
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.set(0,-20,0);
scene.add(floor);

// create an locate the camera
camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
camera.position.set(0, 10, 25);
//target = new THREE.Object3D();

const loader = new FBXLoader();
var arr = [
"img/BirchTree_5.fbx",
"img/BirchTree_4.fbx"
]; 
// load a resource

for(let i = 0; i<2; i++){
loader.load(
    // resource URL
    arr[i],

    function (object) {
    object.castShadow = true;
    object.scale.set(0.1, 0.1, 0.1);
    object.position.set(i*30, -25, i*30-30);
    scene.add(object);
    },
    // called when loading is in progresses
    function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },

    function (error) {
    console.log("An error happened");
    }
);

}

createGeometry();

// create the renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding,
});

cubeCamera2 = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

const refGeometry = new THREE.SphereGeometry(20, 32, 32);
const refMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeRenderTarget.texture,
    combine: THREE.MultiplyOperation,
    reflectivity: 1,
});

const reflective = new THREE.Mesh(refGeometry, refMaterial);

reflective.castShadow = true;
reflective.receiveShadow = true;

reflective.position.set(-3, 30, 10);
scene.add(reflective);

const geometry = new THREE.BoxGeometry(3, 3, 3);
const cubes = [
    makeInstance(geometry, "skyblue", 0),
    makeInstance(geometry, "darkseagreen", 4),
    makeInstance(geometry, "darksalmon", 8),
];

const textured_geo = new THREE.SphereGeometry(2, 20, 20);

const spheres = [
    makeTextured(textured_geo, "img/pic10.jpg", -6),
    makeTextured(textured_geo, "img/pic20.jpg", -10),
    makeTextured(textured_geo, "img/pic21.jpg", -14),
];

scene.traverse( function( child ) { 

    if ( child.isMesh ) {

        child.castShadow = true;
        child.receiveShadow = true;

    }
} );
// controls

controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
};

let mainLoop = function () {
requestAnimationFrame(mainLoop);
renderer.render(scene, camera);
cubeCamera2.update(renderer, scene);
controls.update();
};

///////////////////////////////////////////////
init();
mainLoop();
