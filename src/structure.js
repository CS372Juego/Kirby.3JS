import * as THREE from 'three';
import { Colors } from './color.js';

// Temporary tree from project5..
// To be replaced with a model
export class Tree {
    constructor() {
        this.mesh = new THREE.Object3D();

        // Create leaves
        let geoLeaves = new THREE.DodecahedronGeometry(25, 1);
        let matLeaves = new THREE.MeshPhongMaterial({
            color: Colors.green,
            flatShading: true,
        });

        // Create trunk
        let geoTrunk = new THREE.CylinderGeometry(3, 4, 50, 5);
        let matTrunk = new THREE.MeshPhongMaterial({
            color: Colors.brown,
        });

        let numLeaves = 5;
        let leaveSizes = [0.8, 0.38, 0.2, 0.5, 0.4];
        let leavePos = [[0, 30, 0], [12, 23, 8], [0, 25, 16], [-15, 33, -5], [-16, 24, 10]];
        for (let i = 0; i < numLeaves; i++) {
            let leaves = new THREE.Mesh(geoLeaves, matLeaves);
            leaves.position.set(...leavePos[i]);
            
            let scale = leaveSizes[i];
            leaves.scale.set(scale, scale, scale);
            
            // Random rotation
            leaves.rotation.x = Math.random() * Math.PI * 2;
            leaves.rotation.y = Math.random() * Math.PI * 2;

            leaves.castShadow = true;
            leaves.receiveShadow = true;
            this.mesh.add(leaves);
        }

        this.trunk = new THREE.Mesh(geoTrunk, matTrunk);
        this.trunk.castShadow = true;
        this.trunk.receiveShadow = true;
        this.mesh.add(this.trunk);
    }
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

