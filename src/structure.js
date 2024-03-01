import * as THREE from 'three';
import { Colors } from './color.js';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { QuaterniusModel } from '../animation-class/QuaterniusModel.js';

/**
 * Represents a tree object.
 * @class
 */
export class Tree {
    constructor() {
        this.mesh = new THREE.Object3D();

        let geoTrunk = new THREE.CylinderGeometry(3, 4, 50, 5);
        let matTrunk = new THREE.MeshPhongMaterial({ visible: false });

        this.trunk = new THREE.Mesh(geoTrunk, matTrunk);
        this.mesh.add(this.trunk);
    }
}

/**
 * Loads a tree model asynchronously.
 * @returns {Promise<QuaterniusModel>} A promise that resolves with the loaded tree model.
 */
export async function loadTreeModel() {
    const treeModel = new QuaterniusModel();
    await treeModel.load('../assets/model/tree.glb', Math.PI/2);
    treeModel.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    return treeModel;
}

/**
 * Represents a Spikes object.
 * @class
 */
export class Spikes {
    constructor() {
        this.mesh = new THREE.Object3D();
        let geoSpike = new THREE.ConeGeometry(2, 10, 10);
        let matSpike = new THREE.MeshPhongMaterial({
            color: Colors.white,
        });

        let numSpikes = 5;
        let spikePos = [[0, 0, 0], [5, 0, 5], [-5, 0, -5], [5, 0, -5], [-5, 0, 5]];
        for (let i = 0; i < numSpikes; i++) {
            let spike = new THREE.Mesh(geoSpike, matSpike);
            spike.position.set(...spikePos[i]);
            spike.castShadow = true;
            spike.receiveShadow = true;
            this.mesh.add(spike);
        }
    }
}

/**
 * Represents a star box in the scene.
 * @class
 */
export class StarBox {
    constructor() {
        this.mesh = new THREE.Object3D();
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('../assets/texture/starbox.png');

        let geoBox = new THREE.BoxGeometry(5, 5, 5);
        let matBox = new THREE.MeshPhongMaterial({ map: texture });
        let starBox = new THREE.Mesh(geoBox, matBox);

        starBox.castShadow = true;
        starBox.receiveShadow = true;
        this.mesh.add(starBox);
    }
}

/**
 * Represents a star object in the scene.
 * @class
 */
export class Star {
    constructor(){
        this.mesh = new THREE.Object3D();
        let geometryStar = new THREE.CylinderGeometry(5, 5, 2, 5);
        let materialStar = new THREE.MeshPhongMaterial({ visible: false });
        let star = new THREE.Mesh(geometryStar, materialStar);
        star.position.set(0, 0, 0);
        star.rotation.x = -Math.PI / 2;
        this.mesh.add(star);
    }
}

/**
 * Loads the star model asynchronously.
 * @returns {Promise<THREE.Object3D>} A promise that resolves with the loaded star model.
 */
export async function loadStarModel() {
    return new Promise((resolve, reject) => {
        const mtlLoader = new MTLLoader();

        mtlLoader.load('../assets/model/star/WarpStar.mtl', (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../assets/model/star/WarpStar.obj', (obj) => {
                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                resolve(obj);
            }, undefined, reject);
        });
    });
}

/**
 * Loads the Gordo model asynchronously.
 * @returns {Promise<THREE.Object3D>} A promise that resolves with the loaded Gordo model as a THREE.Object3D.
 */
function loadGordoModel() {
    return new Promise((resolve, reject) => {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('../assets/model/gordo/DolGordo.mtl', (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../assets/model/gordo/DolGordo.obj', (obj) => {
                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                resolve(obj);
            }, undefined, reject);
        });
    });
}

/**
 * Creates an enemy object with the specified parameters.
 * @param {number} x - The x-coordinate of the enemy's position.
 * @param {number} y - The y-coordinate of the enemy's position.
 * @param {number} z - The z-coordinate of the enemy's position.
 * @param {number} leftBound - The left boundary of the enemy's movement range.
 * @param {number} rightBound - The right boundary of the enemy's movement range.
 * @param {THREE.Scene} scene - The scene to which the enemy will be added.
 * @returns {Promise<THREE.Mesh>} A promise that resolves to the created enemy collider mesh.
 */
export function createEnemy(x, y, z, leftBound, rightBound, scene) {
    return loadGordoModel().then((gordoModel) => {
        const enemyModel = gordoModel;

        enemyModel.scale.set(0.4, 0.4, 0.4);
        const enemyGeometry = new THREE.SphereGeometry(2, 32, 16);
        const enemyMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible
        const enemyCollider = new THREE.Mesh(enemyGeometry, enemyMaterial);

        enemyCollider.position.set(x, y, z);
        enemyCollider.rotation.set(0, -Math.PI/6, 0);
        enemyCollider.add(enemyModel);

        // Set initial velocity direction
        enemyCollider.userData = { direction: 1, leftBound: leftBound, rightBound: rightBound };
        enemyCollider.layers.set(1); // Ignore during collision detection
        scene.add(enemyCollider);

        return enemyCollider;
    });
}

export class Door {
    constructor() {
        this.mesh = new THREE.Object3D();
        let geometry = new THREE.BoxGeometry(10, 20, 1);
        let material = new THREE.MeshPhongMaterial({ visible: false });
        let door = new THREE.Mesh(geometry, material);
        door.position.set(0, 0, 0);
        door.castShadow = true;
        door.receiveShadow = true;
        this.mesh.add(door);
    }
}

/**
 * Loads the door model asynchronously.
 * @returns {Promise<QuaterniusModel>} A promise that resolves with the loaded door model.
 */
export async function loadDoorModel() {
    return new Promise((resolve, reject) => {
        const portalModel = new QuaterniusModel();
        portalModel.load('../assets/model/portal.glb', Math.PI/2);
        portalModel.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        resolve(portalModel);
    });
}
