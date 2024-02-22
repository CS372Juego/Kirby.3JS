/* 
 * CS 372 Final Project
 * Calvin University
 * Jason Chew, Daniel Kim
 * Feb. 2024
 * 3D Models provided by Quaternius: https://poly.pizza/u/Quaternius
 */

import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { ColladaLoader } from 'ColladaLoader';

//=====< Colors >=====//
let Colors = {
    white: 0xDCF2F1,
    black: 0x3D3B40,
    red: 0xFF6868,
    orange: 0xFFA447,
    yellow: 0xFAEF9B,
    green: 0xA1DD70,
    blue: 0xAEDEFC,
    pink: 0xFF9EAA,
};

// Trigger the animation when the page is loaded
window.onload = function () {
    init();
};

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer;
let isGameRunning = true;
const loader = new GLTFLoader();

//=====< Set up the scene >=====//
function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0xFAF1E4, 100, 950);
    // scene.fog.far = 2000;

    // Create the camera
    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 0.1;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    // Set the position of the camera
    camera.position.set(0, 10, 20);

    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', handleWindowResize, false);
}

//=====< Handle the window resize event >=====//
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

//=====< Add the lights >=====//
let hemisphereLight, dirLight;
function createLights() {
    // gradient light: sky color - ground color - intensity
    // hemisphereLight = new THREE.HemisphereLight(0xFFC0D9, 0x000000, 0.9)
    dirLight = new THREE.DirectionalLight(0xD5FFD0, 0.9);
    dirLight.position.set(150, 350, 350);
    dirLight.castShadow = true;

    // define the visible area of the projected shadow
    dirLight.shadow.camera.left = -400;
    dirLight.shadow.camera.right = 400;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -400;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 1000;

    // Set the resolution of the shadow map
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    // Add lights to scene
    // scene.add(hemisphereLight);
    scene.add(dirLight);
}

//=====< Add the world >=====//
const world = new CANNON.World();

function createWorld() {
    let geometry = new THREE.BoxGeometry(150, 8, 3);
    let material = new THREE.MeshBasicMaterial({color: Colors.green});
    let floor = new THREE.Mesh(geometry, material);
    floor.position.set(40, 0, 0);
    scene.add(floor);
}


function loop() {
    if (!isGameRunning) {
        return;
    }
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
}



function runScene() {
    createLights();
    createWorld();
    loop();
}


//=====< Initialize >=====//
function init(event) {
    createScene();
    runScene();
}

