import * as THREE from 'three';
import { Colors } from './color.js';

export const LAND_LENGTH_2 = 300;
export const LAND_OFFSET_2 = 20;
export const LAND_BEGIN_X_2 = -LAND_LENGTH_2 / 2 + LAND_OFFSET_2;
export const LAND_END_X_2 = LAND_LENGTH_2 / 2 - LAND_OFFSET_2;

export function createWorld2(scene) {
    let geometry = new THREE.BoxGeometry(LAND_LENGTH_2, 10, 12);
    let material = new THREE.MeshPhongMaterial({ color: Colors.blue });
    let plain = new THREE.Mesh(geometry, material);
    plain.position.set(0, -10, 0);
    scene.add(plain);
}
