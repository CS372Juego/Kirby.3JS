import * as THREE from 'three';
import { Colors } from './color.js';

const LAND_WIDTH = 15;
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

    geometry = new THREE.BoxGeometry(10, 12, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X+10.1, 3, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 5, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 23.5, 3, 0);
    plain.rotation.z = -Math.PI / 8;
    world2.add(plain);

    geometry = new THREE.BoxGeometry(5, 10, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 50, 5, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(5, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 54.9, 5, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 80, 5, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 110, 14, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 130, 14, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(10, 3, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 150, 14, 0);
    world2.add(plain);

    geometry = new THREE.BoxGeometry(20, 20, LAND_WIDTH);
    plain = new THREE.Mesh(geometry, material);
    plain.position.set(LAND_BEGIN_X + 180, 5, 0);
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
