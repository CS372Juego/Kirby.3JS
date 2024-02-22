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

//=====< Global Variables >=====//
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer;
let kirby;
let targetPosition;
let isGameRunning = true;
const SMOOTHNESS = 0.05;
const CAMERA_SMOOTHNESS = 0.1;
const LAND_BEGIN = 5;
let LAND_BEGIN_X;
let LAND_END_X;
const LAND_END = -5;
const loader = new GLTFLoader();

//=====< Set up the scene >=====//
function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFAF1E4, 100, 950);
    scene.fog.far = 200;

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
    hemisphereLight = new THREE.HemisphereLight(0xFFC0D9, 0x000000, 0.9)
    dirLight = new THREE.DirectionalLight(0xDCF2F1, 0.9);
    dirLight.position.set(50, 350, 200);
    dirLight.castShadow = true;

    // define the visible area of the projected shadow
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 100;

    // Set the resolution of the shadow map
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    // Add lights to scene
    scene.add(hemisphereLight);
    scene.add(dirLight);
}

//=====< Add the world >=====//
let LAND_LENGTH = 200;
let LAND_OFFSET = 15;
LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;
function createWorld() {
    // Temporary plain
    let geometry = new THREE.BoxGeometry(LAND_LENGTH, 8, 10);
    let material = new THREE.MeshPhongMaterial({color: Colors.green});
    let plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    scene.add(plain);
}

function createKirby() {
    let geometry = new THREE.DodecahedronGeometry(2, 2);
    let material = new THREE.MeshPhongMaterial({color: Colors.pink});
    kirby = new THREE.Mesh(geometry, material);
    kirby.position.set(LAND_BEGIN_X, 6, 0);
    kirby.castShadow = true;
    kirby.receiveShadow = true;
    scene.add(kirby);

    // Initialize targetPosition here
    targetPosition = {
        x: kirby.position.x,
        y: kirby.position.y,
        z: kirby.position.z,
    };
}

//=====< Add Keyboard Interaction >=====//
const keyState = {};
window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});


// Function to handle keyboard input
const kirbySpeed = 0.2;
let isJumping = false;
let jumpVelocity = 1;
const jumpSpeed = 0.25;
const gravity = -0.0025;

function handleKeyboardInput() {
    if (!kirby) return;
    if (keyState['KeyW']) {
        targetPosition.z -= kirbySpeed;
    }
    if (keyState['KeyS']) {
        targetPosition.z += kirbySpeed;
    }
    if (keyState['KeyA']) {
        targetPosition.x -= kirbySpeed;
    }
    if (keyState['KeyD']) {
        targetPosition.x += kirbySpeed;
    }
    if (keyState['Space'] && !isJumping) {
        isJumping = true;
        jumpVelocity = jumpSpeed;
    }

    // Apply boundary checks
    targetPosition.z = Math.min(LAND_BEGIN, Math.max(LAND_END, targetPosition.z));
    targetPosition.x = Math.min(LAND_END_X, Math.max(LAND_BEGIN_X, targetPosition.x));
}

// Smooth movement (Source: ChatGPT)
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function updateKirbyPosition() {
    kirby.position.x = lerp(kirby.position.x, targetPosition.x, SMOOTHNESS);
    kirby.position.z = lerp(kirby.position.z, targetPosition.z, SMOOTHNESS);

    // Handle Jumping
    if (isJumping) {
        kirby.position.y += jumpVelocity;
        jumpVelocity += gravity;

        // Check if Kirby has landed
        if (kirby.position.y <= targetPosition.y) {
            kirby.position.y = targetPosition.y;
            isJumping = false;
            jumpVelocity = 0;
        }
    }
}

function loop() {
    if (!isGameRunning) {
        return;
    }
    handleKeyboardInput();
    updateKirbyPosition();
    
    camera.position.x = lerp(camera.position.x, kirby.position.x, CAMERA_SMOOTHNESS);
    camera.position.y = lerp(camera.position.y, kirby.position.y + 3, CAMERA_SMOOTHNESS);
    camera.position.z = lerp(camera.position.z, kirby.position.z + 20, CAMERA_SMOOTHNESS);
    
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
}

function runScene() {
    createLights();
    createWorld();
    createKirby();
    loop();
}

//=====< Initialize >=====//
function init(event) {
    createScene();
    runScene();
}


