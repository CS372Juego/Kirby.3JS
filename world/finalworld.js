import * as THREE from 'three';
import { Colors } from '../src/color.js';

const LAND_WIDTH = 20;
export const WORLDF_OFFSET_X = 600;

const LAND_LENGTH = 100;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
let geometry, plain;
let material = new THREE.MeshPhongMaterial({ color: Colors.green });


export function createWorldF(scene) {
    let world2 = new THREE.Group();

    geometry = new THREE.BoxGeometry(LAND_LENGTH, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X-LAND_OFFSET-10, 20, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_END_X+LAND_OFFSET+10, 20, 0);
    world2.add(plain);

    world2.position.x = WORLDF_OFFSET_X;
    scene.add(world2);

    //=====< Trees >=====//
    let tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLDF_OFFSET_X + 5, 10, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLDF_OFFSET_X + 65, 10, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
}

// Temporary tree from project5..
// To be replaced with a model
let Tree = function() {
    this.mesh = new THREE.Object3D();

    // Create leaves
    let geoLeaves = new THREE.DodecahedronGeometry(25, 1);
    let matLeaves = new THREE.MeshPhongMaterial({
        color: Colors.green,
        flatShading: true
    });

    // Create trunk
    let geoTrunk = new THREE.CylinderGeometry(3, 4, 50, 5);
    let matTrunk = new THREE.MeshPhongMaterial({
        color: Colors.brown
    });

    let numLeaves = 5;
    let leaveSizes = [0.8, 0.38, 0.2, 0.5, 0.4];
    let leavePos = [[0, 30, 0], [12, 23, 8], [0, 25, 16], [-15, 33, -5], [-16, 24, 10]];
    for (let i=0; i < numLeaves; i++) {
        let leaves = new THREE.Mesh(geoLeaves, matLeaves);
        leaves.position.set(leavePos[i][0], leavePos[i][1], leavePos[i][2]);
        
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

export function removeWorldF(scene) {
    scene.traverse(object => {
        if (object.geometry) {
            object.geometry.dispose();
        }
        if (object.material) {
            if (object.material.map) {
                object.material.map.dispose();
            }
            object.material.dispose();
        }
    });
    scene.remove(...scene.children);
}
