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
