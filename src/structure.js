import * as THREE from 'three';
import { Colors } from './color.js';
import { QuaterniusModel } from '../animation-class/QuaterniusModel.js';

// Temporary tree from project5..
// TO DO: Load model to the trunk (collision detection with trunk, but not leaves)
// TO DO: bypass raycasting for model
export class Tree {
    constructor() {
        this.mesh = new THREE.Object3D();

        let geoTrunk = new THREE.CylinderGeometry(3, 4, 50, 5);
        let matTrunk = new THREE.MeshPhongMaterial({ visible: false });

        this.trunk = new THREE.Mesh(geoTrunk, matTrunk);
        this.mesh.add(this.trunk);
    }
}

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

// Temporary spikes..
// To be replaced with a model
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

// Temporary Star Boxes//
// To be replaced with a model
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
