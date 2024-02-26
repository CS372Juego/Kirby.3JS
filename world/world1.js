import * as THREE from 'three';
import { Colors } from '../src/color.js';
import { Tree, Spikes } from '../src/structure.js';

export const LAND_LENGTH = 300;
export const LAND_OFFSET = 15;
export const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
export const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
let geometry, plain;
let material = new THREE.MeshPhongMaterial({ color: Colors.green });
const LAND_WIDTH = 20;

export function createWorld1(scene) {
    let world1 = new THREE.Group();

    //=====< Level Structure >=====//
    geometry = new THREE.BoxGeometry(LAND_LENGTH, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X-LAND_OFFSET-10, 20, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(10, 12, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X+10.1, 3, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(20, 5, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 23.5, 3, 0);
    plain.rotation.z = -Math.PI / 8;
    world1.add(plain);

    geometry = new THREE.BoxGeometry(5, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 50, 5, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(5, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 54.9, 5, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(20, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 80, 5, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 110, 14, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 130, 14, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 150, 14, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(20, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 180, 5, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(20, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 197, 6.4, 0);
    plain.rotation.z = -Math.PI / 8;
    world1.add(plain);

    geometry = new THREE.BoxGeometry(30, 12, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 210, 3, 0);
    world1.add(plain);

    geometry = new THREE.BoxGeometry(20, 5, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 233, 3, 0);
    plain.rotation.z = -Math.PI / 8;
    world1.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_END_X+LAND_OFFSET + 10, 20, 0);
    world1.add(plain);

    scene.add(world1);

    //=====< Trees >=====//
    let tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + 10, 15, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + 180, 20, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + 250, 9, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + 265, 9, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    //=====< Spikes >=====//
    let spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 60.5, 6, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 66.5, 6, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 60.5, 6, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 66.5, 6, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 60.5, 6, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + 66.5, 6, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
}

export function removeWorld1(scene) {
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
