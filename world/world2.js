import * as THREE from 'three';
import { Colors } from '../src/color.js';
import { Tree, Spikes } from '../src/structure.js';

const LAND_WIDTH = 20;
export const WORLD2_OFFSET_X = 350;

const LAND_LENGTH = 300;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
let geometry, plain;
let material = new THREE.MeshPhongMaterial({ color: Colors.green });


export function createWorld2(scene) {
    let world2 = new THREE.Group();

    geometry = new THREE.BoxGeometry(LAND_LENGTH, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X-LAND_OFFSET-10, 20, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 30, 5, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 60, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 65, 40, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 90, 14, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 80, 24, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 90, 34, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 80, 44, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 90, 54, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 120, 70, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(50, 60, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 120, 30, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 165, 54, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 150, 44, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 165, 34, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 150, 24, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 15, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 150, 10, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 180, 45, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(30, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 170, 7, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 182, 6.4, 0);
    plain.rotation.z = Math.PI / 8;
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 197, 6.4, 0);
    plain.rotation.z = -Math.PI / 8;
    world2.add(plain);

    geometry = new THREE.BoxGeometry(30, 12, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 210, 3, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 5, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 233, 3, 0);
    plain.rotation.z = -Math.PI / 8;
    world2.add(plain);

    geometry = new THREE.BoxGeometry(40, 50, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_END_X+LAND_OFFSET+10, 20, 0);
    world2.add(plain);

    world2.position.x = WORLD2_OFFSET_X;
    scene.add(world2);

    //=====< Trees >=====//
    let tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 5, 10, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 30, 23, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 58, 75, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 72, 75, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 172, 75, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 188, 75, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 250, 9, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);
    tree = new Tree();
    tree.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 265, 9, -5);
    tree.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(tree.mesh);

    //=====< Spikes >=====//
    let spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 117.5, 61, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 122.5, 61, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 117.5, 61, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 122.5, 61, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 117.5, 61, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X + WORLD2_OFFSET_X + 122.5, 61, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
}

export function removeWorld2(scene) {
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
