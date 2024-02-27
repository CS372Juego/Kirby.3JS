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
import { MMDLoader } from 'MMDLoader';
import { Colors } from './color.js';
import { PortalManager } from './PortalManager.js';
import { QuaterniusModel } from '../animation-class/QuaterniusModel.js';
import { createWorld1, LAND_BEGIN_X, LAND_END_X } from '../world/world1.js';
import { createWorld2, WORLD2_OFFSET_X } from '../world/world2.js';
import { createWorldF, WORLDF_OFFSET_X } from '../world/finalworld.js';

//=====< Global Variables >=====//
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer;
let kirby, kirbyModel;
let portalManager;
let targetPosition;
let isGameRunning = true;
let walkingAnimationIndex = 2;
const KIRBY_SIZE = 2.7;
const SMOOTHNESS = 0.05;
const CAMERA_SMOOTHNESS = 0.1;
const LAND_BEGIN = 5;
const LAND_END = -5;
const clock = new THREE.Clock();
const gtlfLoader = new GLTFLoader();
const colladaLoader = new ColladaLoader();
const mmdLoader = new MMDLoader();

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
async function createKirby() {
    try {
        // let geometry = new THREE.DodecahedronGeometry(KIRBY_SIZE, KIRBY_SIZE);
        let geometry = new THREE.SphereGeometry(KIRBY_SIZE, 32, 32);
        let material = new THREE.MeshPhongMaterial( {visible: false} ); // Set visible to true
        kirby = new THREE.Mesh(geometry, material);

        kirby.position.set(LAND_BEGIN_X, 7, 0);
        // kirby.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X, 7, 0);
        // kirby.position.set(LAND_BEGIN_X + WORLDF_OFFSET_X + 100, 7, 0);

        scene.add(kirby);

        // Initialize targetPosition here
        targetPosition = {
            x: kirby.position.x,
            y: kirby.position.y,
            z: kirby.position.z,
        };

        kirbyModel = new QuaterniusModel();
        // New methods
        await kirbyModel.load('../assets/model/kirby.glb', Math.PI/2);
        kirbyModel.cueAnimation(0, true, 0);

        // Inherits THREE.Object3D() methods
        kirbyModel.scale.set(0.03, 0.03, 0.03);

        kirbyModel.traverse((child) => {
            if (child.isMesh) {
                child.raycast = function () {};
            }
        });

        kirby.add(kirbyModel);
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

//=====< Add Keyboard Interaction >=====//
const keyState = {};
window.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
    if (event.shiftKey) {
        kirbySpeed = baseKirbySpeed * 2; // Double the speed
        walkingAnimationIndex = 1;
    } else {
        kirbySpeed = baseKirbySpeed; // Normal speed
        walkingAnimationIndex = 2;
    }
});

window.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
    kirbySpeed = baseKirbySpeed; // Reset speed
    if (event.shiftKey) {
        kirbyModel.cueAnimation(2, true, 0);
    }
    // Stop animation and reset to idle
    kirbyModel.stopAnimation(0.3);
    kirbyModel.cueAnimation(0, true, 0);
});


// Function to handle keyboard input
const baseKirbySpeed = 0.15;
let kirbySpeed = baseKirbySpeed;
let isJumping = false;
let jumpVelocity = 10;
const jumpSpeed = 1.75;
const gravity = -0.15;

function handleKeyboardInput(deltaTime, direction) {
    if (!kirby) return;
    if (keyState['KeyW']) {
        targetPosition.z -= kirbySpeed * deltaTime * 100;
        direction.z -= baseKirbySpeed * deltaTime * 200;
        kirbyModel.cueAnimation(walkingAnimationIndex, true, 0);
    }
    if (keyState['KeyS']) {
        targetPosition.z += kirbySpeed * deltaTime * 100;
        direction.z += baseKirbySpeed * deltaTime * 200;
        kirbyModel.cueAnimation(walkingAnimationIndex, true, 0);
    }
    if (keyState['KeyA']) {
        targetPosition.x -= kirbySpeed * deltaTime * 100;
        direction.x -= baseKirbySpeed * deltaTime * 200;
        kirbyModel.cueAnimation(walkingAnimationIndex, true, 0);
    }
    if (keyState['KeyD']) {
        targetPosition.x += kirbySpeed * deltaTime * 100;
        direction.x += baseKirbySpeed * deltaTime * 200;
        kirbyModel.cueAnimation(walkingAnimationIndex, true, 0);
    }
    if (keyState['Space'] && !isJumping) {
        kirbyModel.cueAnimation(0, false, 0.3);
        isJumping = true;
        jumpVelocity = jumpSpeed;
    }

    // Boundary checks
    targetPosition.z = Math.min(LAND_BEGIN, Math.max(LAND_END, targetPosition.z));
}

// Smooth movement (Source: ChatGPT)
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

let downVector = new THREE.Vector3(0, -1, 0);
let groundLevel = null;

function updateKirbyPosition(deltaTime) {
    // Determine the direction of movement
    let movementDirection = new THREE.Vector3(
        targetPosition.x - kirby.position.x,
        0, // Ignore vertical movement for wall detection
        targetPosition.z - kirby.position.z
    ).normalize();

    // Cast a ray upwards from Kirby's position to detect ceilings
    let ceilingRaycaster = new THREE.Raycaster(kirby.position, new THREE.Vector3(0, 1, 0), 0, 10);
    let ceilingIntersects = ceilingRaycaster.intersectObjects(scene.children, true);

    let ceilingDetected = ceilingIntersects.length > 0;
    let ceilingLevel = null;

    if (ceilingDetected) {
        let distanceToCeiling = ceilingIntersects[0].distance;
        ceilingLevel = kirby.position.y + distanceToCeiling - KIRBY_SIZE;
    }

    // Cast a ray in the direction Kirby is moving to detect walls
    let wallRaycaster = new THREE.Raycaster(kirby.position, movementDirection, 0, KIRBY_SIZE);
    let wallIntersects = wallRaycaster.intersectObjects(scene.children, true); // Check for walls

    let wallDetected = wallIntersects.length > 0;

    if (!wallDetected) {
        // Update horizontal movement if no wall is detected
        kirby.position.x = lerp(kirby.position.x, targetPosition.x, SMOOTHNESS);
        kirby.position.z = lerp(kirby.position.z, targetPosition.z, SMOOTHNESS);
    }

    // Raycast downwards to find the ground
    let groundRaycaster = new THREE.Raycaster(kirby.position, downVector);
    let intersects = groundRaycaster.intersectObjects(scene.children, true);

    // Check if intersects found before accessing the distance property
    if (intersects.length > 0) {
        let distanceToGround = intersects[0].distance;
        groundLevel = kirby.position.y - distanceToGround + KIRBY_SIZE;
    } else {
        groundLevel = -Infinity; // Kirby is over a void
    }

    // Handle Jumping and gravity
    if (isJumping) {
        kirby.position.y += jumpVelocity * deltaTime * 20;
        jumpVelocity += gravity * deltaTime * 20;

        // Implement logic when Kirby is above the void
        if (kirby.position.y <= groundLevel || groundLevel === -Infinity) {
            if (groundLevel !== -Infinity) {
                kirby.position.y = groundLevel;
                isJumping = false;
                jumpVelocity = 0;
            }
        }
        if (ceilingDetected && kirby.position.y >= ceilingLevel) {
            kirby.position.y = lerp(kirby.position.y, groundLevel, SMOOTHNESS * deltaTime * 100);
            jumpVelocity = 0; // Stop upward movement
        }
    } else {
        // Adjust for ground level changes
        if (kirby.position.y > groundLevel && groundLevel !== -Infinity) {
            kirby.position.y = lerp(kirby.position.y, groundLevel, SMOOTHNESS * deltaTime * 100);
        } else if (kirby.position.y < groundLevel) {
            // Kirby can climb up slopes
            kirby.position.y = groundLevel;
        } else if (groundLevel === -Infinity) {
            // Apply gravity if Kirby is over a void
            kirby.position.y += gravity * deltaTime * 20;
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

    let direction = {
        x: 0,
        z: 0,
    }

    handleKeyboardInput(deltaTime, direction);
    updateKirbyPosition(deltaTime);

    kirbyModel.advanceAnimation(deltaTime);
    alignRotation(kirbyModel, direction);
    
    // Uncomment the code below after creating the portal(with positions)
    // portalManager.checkPortals(kirby, keyState);

    // Camera for gameplay
    camera.position.x = lerp(camera.position.x, kirby.position.x, CAMERA_SMOOTHNESS);
    camera.position.y = lerp(camera.position.y, kirby.position.y + 10, CAMERA_SMOOTHNESS);
    camera.position.z = lerp(camera.position.z, kirby.position.z + 20, CAMERA_SMOOTHNESS);

    // Camera for construction
    // camera.position.x = lerp(camera.position.x, kirby.position.x, CAMERA_SMOOTHNESS);
    // camera.position.y = lerp(camera.position.y, kirby.position.y + 50, CAMERA_SMOOTHNESS);
    // camera.position.z = lerp(camera.position.z, kirby.position.z + 200, CAMERA_SMOOTHNESS);
    
    requestAnimationFrame(loop);
    renderer.render(scene,camera)
}

function alignRotation(obj, vel) {
    if(vel.x != 0 || vel.z != 0) {
        const targetAngle = -Math.atan2(vel.z, vel.x);
        var targetRotation = new THREE.Quaternion();
        targetRotation.setFromEuler(new THREE.Euler(0, targetAngle, 0));
        obj.quaternion.rotateTowards(targetRotation, 0.1);
    }
}


//=====< Initialize >=====//
window.onload = function () {
    init();
};

function runScene() {
    createLights();
    createWorld1(scene);
    createWorld2(scene);
    createWorldF(scene);
    createKirby();
    // createPortals();
    loop();
}

function init(event) {
    createScene();
    runScene();
}


