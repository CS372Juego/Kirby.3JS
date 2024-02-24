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
import { Colors } from './color.js';
import { PortalManager } from './PortalManager.js';
import { createWorld1, LAND_BEGIN_X, LAND_END_X } from './world1.js';
import { createWorld2 } from './world2.js';

//=====< Global Variables >=====//
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer;
let kirby;
let portalManager;
let targetPosition;
let isGameRunning = true;
const SMOOTHNESS = 0.05;
const CAMERA_SMOOTHNESS = 0.1;
const LAND_BEGIN = 5;
const LAND_END = -5;
const clock = new THREE.Clock();
const gtlfLoader = new GLTFLoader();
const colladaLoader = new ColladaLoader();

//=====< Set up the scene >=====//
function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Create the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFAF1E4, 100, 950);
    // scene.fog.far = 200;

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
    camera.rotateX(-Math.PI / 8);

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


//=======< Add Kirby >=====//
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
    if (event.shiftKey) {
        kirbySpeed = baseKirbySpeed * 2; // Double the speed
    } else {
        kirbySpeed = baseKirbySpeed; // Normal speed
    }
});

window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
    kirbySpeed = baseKirbySpeed; // Reset speed
});


// Function to handle keyboard input
const baseKirbySpeed = 0.15;
let kirbySpeed = baseKirbySpeed;
let isJumping = false;
let jumpVelocity = 10;
const jumpSpeed = 1.75;
const gravity = -0.15;

function handleKeyboardInput(deltaTime) {
    if (!kirby) return;
    if (keyState['KeyW']) {
        targetPosition.z -= kirbySpeed * deltaTime * 100;
    }
    if (keyState['KeyS']) {
        targetPosition.z += kirbySpeed * deltaTime * 100;
    }
    if (keyState['KeyA']) {
        targetPosition.x -= kirbySpeed * deltaTime * 100;
    }
    if (keyState['KeyD']) {
        targetPosition.x += kirbySpeed * deltaTime * 100;
    }
    if (keyState['Space'] && !isJumping) {
        isJumping = true;
        jumpVelocity = jumpSpeed;
    }

    // // Boundary checks
    targetPosition.z = Math.min(LAND_BEGIN, Math.max(LAND_END, targetPosition.z));
    // targetPosition.x = Math.min(LAND_END_X, Math.max(LAND_BEGIN_X, targetPosition.x));
}

// Smooth movement (Source: ChatGPT)
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

let raycaster = new THREE.Raycaster();
let downVector = new THREE.Vector3(0, -1, 0);
let groundLevel = null;

function updateKirbyPosition(deltaTime) {
    // Determine the direction of movement
    let movementDirection = new THREE.Vector3(
        targetPosition.x - kirby.position.x,
        0,
        targetPosition.z - kirby.position.z
    ).normalize();

    // Cast a ray in the direction Kirby is moving to detect walls
    let wallRaycaster = new THREE.Raycaster(kirby.position, movementDirection, 0, 2);
    let wallIntersects = wallRaycaster.intersectObjects(scene.children, true); // Check for walls

    let wallDetected = wallIntersects.length > 0;

    if (!wallDetected) {
        // Update horizontal movement if no wall is detected
        kirby.position.x = lerp(kirby.position.x, targetPosition.x, SMOOTHNESS);
        kirby.position.z = lerp(kirby.position.z, targetPosition.z, SMOOTHNESS);
    }

    // Raycast downwards to find the ground
    raycaster.set(kirby.position, downVector);
    let intersects = raycaster.intersectObjects(scene.children, true);

    let distanceToGround = intersects[0].distance;
    if (intersects.length > 0) {
        groundLevel = kirby.position.y - distanceToGround + 2;
    }

    // Handle Jumping and gravity
    if (isJumping) {
        kirby.position.y += jumpVelocity * deltaTime * 20;
        jumpVelocity += gravity * deltaTime * 20;

        if (kirby.position.y <= groundLevel) {
            kirby.position.y = groundLevel;
            isJumping = false;
            jumpVelocity = 0;
        }
    } else {
        // Adjust for ground level changes
        if (kirby.position.y > groundLevel) {
            if (distanceToGround > 2)
                kirby.position.y = lerp(kirby.position.y, groundLevel, SMOOTHNESS * deltaTime * 100);
            else
                kirby.position.y = groundLevel;
        } else {
            kirby.position.y = lerp(kirby.position.y, groundLevel, SMOOTHNESS * deltaTime * 100);
        }
    }
}

//=====< Create Portals >=====//
function createPortals() {
    portalManager = new PortalManager(scene);
    
    // TO DO: ADD PORTAL POSITIONS
    portalManager.addPortal(new THREE.Vector3(/* Portal 1 Position */), new THREE.Vector3(/* Destination 1 */));
    portalManager.addPortal(new THREE.Vector3(/* Portal 2 Position */), new THREE.Vector3(/* Destination 2 */));
    
}

//=====< Main Animation Loop >=====//
function loop() {
    const deltaTime = clock.getDelta(); 

    if (!isGameRunning) {
        return;
    }

    // console.log(deltaTime);

    handleKeyboardInput(deltaTime);
    updateKirbyPosition(deltaTime);
    
    // Uncomment the code below after creating the portal(with positions)
    // portalManager.checkPortals(kirby, keyState);

    // camera.position.x = lerp(camera.position.x, kirby.position.x, CAMERA_SMOOTHNESS);
    // camera.position.y = lerp(camera.position.y, kirby.position.y + 10, CAMERA_SMOOTHNESS);
    // camera.position.z = lerp(camera.position.z, kirby.position.z + 20, CAMERA_SMOOTHNESS);
    camera.position.x = lerp(camera.position.x, kirby.position.x, CAMERA_SMOOTHNESS);
    camera.position.y = lerp(camera.position.y, kirby.position.y + 50, CAMERA_SMOOTHNESS);
    camera.position.z = lerp(camera.position.z, kirby.position.z + 200, CAMERA_SMOOTHNESS);
    
    requestAnimationFrame(loop);
    renderer.render(scene,camera)
}


//=====< Initialize >=====//
window.onload = function () {
    init();
};

function runScene() {
    createLights();
    createWorld1(scene);
    // createWorld2(scene);
    createKirby();
    // createPortals();
    loop();
}

function init(event) {
    createScene();
    runScene();
}


