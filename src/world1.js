import * as THREE from 'three';
import { Colors } from './color.js';

export const LAND_LENGTH = 200;
export const LAND_OFFSET = 15;
export const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
export const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

export function createWorld1(scene) {
    let world1 = new THREE.Group();
    let geometry = new THREE.BoxGeometry(LAND_LENGTH, 8, 10);
    let material = new THREE.MeshPhongMaterial({ color: Colors.green });
    let plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, 0, 0);
    world1.add(plain);

    // TO DO: Add more objects to world1


    scene.add(world1);
}
