import * as THREE from 'three';
import { Colors } from '../src/color.js';
import { Tree } from '../src/structure.js';

const LAND_WIDTH = 20;
export const WORLDS_OFFSET_X = -220;

const LAND_LENGTH = 80;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
let geometry, plain;
let material = new THREE.MeshPhongMaterial({ color: Colors.green });


export function createWorldS(scene) {
    let world = new THREE.Group();

    geometry = new THREE.BoxGeometry(LAND_LENGTH, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    world.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X-LAND_OFFSET-10, 20, 0);
    world.add(plain);

    geometry = new THREE.BoxGeometry(10, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_END_X+LAND_OFFSET, 20, 0);
    world.add(plain);

    world.position.x = WORLDS_OFFSET_X;
    scene.add(world);

    //=====< Trees >=====//
    let tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLDS_OFFSET_X + 5, 10, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLDS_OFFSET_X + 45, 10, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
}

export function removeWorldS(scene) {
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
