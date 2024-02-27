/* This demo file showcases various use cases and fixes made via the
 * QuaterniusModel class.
 * Fix: proper bounding box calculation, as shown around the large mech
 * Fix: allow rotation offset so WASD can orient astronaut correctly
 * Fix: cloning a model creates a deep (actual) copy of its geometry
 * Controls:
 * - WASD to rotate astronaut
 * - P to stop animation (set with a 1sec (editable) transition to base pose)
 * - Q for melee attack animation
 * - K for death animation
 * - R for run animation
 * - SPACE bar for run and gun animation
 * Run via "npx serve ."
 */

import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'OrbitControls';
import { QuaterniusModel } from './QuaterniusModel.js';

const MODEL_SPEED = 0.1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, // FOV
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // lower distance range of rendering
  1000, // upper distance range of rendering
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(
  window.innerWidth,
  window.innerHeight,
);
document.body.appendChild(renderer.domElement)

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);

// camera
camera.position.y = 20;
camera.position.z = 10;
const cameraControls = new OrbitControls(camera, renderer.domElement);

// Keystate setup from ChatGPT:
// https://chat.openai.com/share/0f8b0d7e-ca9b-48fd-b347-58c329707370
const keyState = {};
window.addEventListener('keydown', (e) => {
  keyState[e.code] = true;
});
window.addEventListener('keyup', (e) => {
  keyState[e.code] = false;
});

// MODEL DEMO

// New instantiation
const modelA = new QuaterniusModel();
// Start clone as empty QuaterniusModel to avoid errors before assigning
var modelAClone = new QuaterniusModel();

// Loading a new model
(async () => {
  try {
    // New methods
    await modelA.load('/animation-class/public/Mech.glb', Math.PI/2);
    // await modelA.load('/public/Mech.glb', Math.PI/2);
    modelA.cueAnimation(0, true, 0);

    // Inherits THREE.Object3D() methods
    modelA.scale.set(2, 2, 2);
    modelA.position.set(0, 0, -7);

    scene.add(modelA);

    // Verify bounding box fix
    scene.add(getBoundingBox(modelA));
    
    // Make more of the same model without loading again
    modelAClone = modelA.clone();
    modelAClone.cueAnimation(0, true, 0);
    modelAClone.position.set(0, 0, 0);
    scene.add(modelAClone);
    
  } catch (error) {
    console.error("Error loading model:", error);
  }
})();

// Loading another model
const modelB = new QuaterniusModel();
(async () => {
  try {
    await modelB.load('/animation-class/public/Astronaut.glb', Math.PI/2);
    // await modelB.load('/public/Astronaut.glb', Math.PI/2);
    modelB.cueAnimation(10, true, 0);

    modelB.position.set(0, 0, 5);
    scene.add(modelB);
  } catch (error) {
    console.error("Error loading model:", error);
  }
})();

function animate() {
  var direction = {
    x: 0,
    z: 0,
  }
  // Map inputs
  if (keyState['KeyW']) {
    direction.z -= MODEL_SPEED;
  }
  if (keyState['KeyA']) {
    direction.x -= MODEL_SPEED;
  }
  if (keyState['KeyS']) {
    direction.z += MODEL_SPEED;
  }
  if (keyState['KeyD']) {
    direction.x += MODEL_SPEED;
  }
  if (keyState['Space']) {
    modelB.cueAnimation(11, true, 0.3);
  }
  if (keyState['KeyP']) {
    modelB.stopAnimation(1);
  }
  if (keyState['KeyR']) {
    modelB.cueAnimation(10, true, 0.3);
  }
  if (keyState['KeyQ']) {
    // Example: resuming an animation after interrupting with another animation
    var priorAnimation = modelB.currentAnimation;
    modelB.cueAnimation(9, false, 0.1);
    if(priorAnimation != 9 && priorAnimation != 0) {
      modelB.cueAnimation(priorAnimation, true, 1);
    }
  }
  if (keyState['KeyK']) {
    modelB.cueAnimation(0, false, 0.1);
  }

  alignRotation(modelB, direction);

  requestAnimationFrame(animate);
  cameraControls.update();
  renderer.render(scene, camera);
  
  // Play next frame of the models' current animations
  modelA.advanceAnimation();
  modelAClone.advanceAnimation();
  modelB.advanceAnimation();
}

function alignRotation(obj, vel) {
  if(vel.x != 0 || vel.z != 0) {
    const targetAngle = -Math.atan2(vel.z, vel.x);
    var targetRotation = new THREE.Quaternion();
    targetRotation.setFromEuler(new THREE.Euler(0, targetAngle, 0));
    obj.quaternion.rotateTowards(targetRotation, 0.1);
  }
}

function getBoundingBox(obj) {
  return new THREE.BoxHelper(obj, 0x00ff00);
}

animate();