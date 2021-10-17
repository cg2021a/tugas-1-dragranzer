import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


/**
 * Variable definition
 */
let scene, camera, renderer, controls;
let rayCast, mouse;
let selected, highscore, score;
let cubesCount = 0;
let speed = 10000; // auto generate cube in milisecond

const speedAcc = 250;
const minSpeed = 2000;
const maxCube = 200;
const colors = [
    0xA8D8EA,
    0xAA96DA,
    0xFCBAD3,
    0xFFE699,
    0xB1E693,
    0x911F27,
];

/**
 * Main
 */
const init = () => {
    // load html element
    const canvas = document.querySelector('.webgl');
    highscore = document.querySelector('#highscore-val');
    score = document.querySelector('#score-val');

    // create scene and its background
    scene = new THREE.Scene();
    const spaceTexture = new THREE.TextureLoader().load('./assets/white-back.jpg');
    scene.background = spaceTexture;

    // create and locate the camera  
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;
    camera.position.y = 15;

    // create canvas
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // create 30 cubes and auto generates it at some interval
    autoGenerateCubes(50);

    // add light
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(1,-1,-1);
    scene.add(dLight);

    // create orbit control
    controls = new OrbitControls(camera, renderer.domElement);

    // create raycast
    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.setX(-1); mouse.setY(-1);

    // toggle selected collor
    toggleColor();
};

const mainLoop = () => {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(mainLoop);
};

/**
 * Generate cubes
 */
const addCube = () => {
    const geometry = new THREE.SphereGeometry( 2, 12, 8);
    const material = new THREE.MeshToonMaterial({ color: getRandomColor() });
    const sphereMesh = new THREE.Mesh( geometry, material );
    sphereMesh.position.set(getRandomFloat(-20, 20), getRandomFloat(-20, 20), getRandomFloat(-20, 20));
    scene.add(sphereMesh);
    cubesCount += 1;
    return sphereMesh;
};

const autoGenerateCubes = (num = 20) => {
    if (cubesCount <= maxCube - num) {
        Array(num).fill(0).forEach(addCube);
        if (speed >= minSpeed + speedAcc) speed -= speedAcc;
        console.log('Cube added. Current cube amount: ' + cubesCount);
    }
    setTimeout(autoGenerateCubes, speed);
};

/**
 * Manipulate selected cube
 */
const deselect = () => {
    if (selected == null) return;
    selected.obj.material.color.setHex(selected.init_color);
    selected = null;
};

const dispose = (object) => {
    object.geometry.dispose();
    object.material.dispose();
    scene.remove(object);
    renderer.renderLists.dispose();
};

const toggleColor = (once = false) => {
    if (selected) {
        const currentColor = selected.obj.material.color.getHex();
        selected.obj.material.color.setHex(
            (currentColor === 0xffffff)
            ? selected.init_color
            : 0xffffff
        );
    }
    if (once) return;
};

/** 
 * Raycast detection & evaluation
 */ 
document.addEventListener("click", (e) => {
    // normalize
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);

    let intersects = rayCast.intersectObjects(scene.children, false);

    // deselect object
    if (!intersects[0]) {
        deselect();
        return;
    }
    let firstObject = intersects[0].object;

    // compare and dispose if color is the same
    if (selected != null) {
        evaluateObject(firstObject);
        return;
    }

    // select first object
    selected = ({
        obj: firstObject,
        init_color: firstObject.material.color.getHex(),
    });
    toggleColor(true);
    
});

const evaluateObject = (conObject) => {
    if (selected.obj.uuid === conObject.uuid) {
        return;
    }

    const first  = selected.init_color;
    const second = conObject.material.color.getHex();

    const currentScore = parseInt(score.textContent);
    const highScore = parseInt(highscore.textContent);
    let newScore;
    
    if (first === second) {
        dispose(selected.obj);
        dispose(conObject);
        cubesCount -= 2;
        newScore = currentScore + 50;
        console.log('correct');
    } else {
        newScore = currentScore - 25;
        console.log('wrong');
    }
    score.textContent = '' + ((newScore >= 0) ? newScore : 0);
    highscore.textContent = '' + ((newScore > highScore) ? newScore : highScore);
    deselect();
};

/**
 * Helper
 */
 window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}, false);

const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    return colors[Math.floor(Math.random()*colors.length)];
};

document.addEventListener('mousedown', () => {
    document.querySelector('html').classList.toggle('cursor');
});

document.addEventListener('mouseup', () => {
    document.querySelector('html').classList.toggle('cursor');
});

/** 
 * Runner
 */ 
init();
mainLoop();
