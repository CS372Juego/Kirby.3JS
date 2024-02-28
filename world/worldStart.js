import * as THREE from 'three';
import { Colors } from '../src/color.js';
import { Tree, loadTreeModel } from '../src/structure.js';

const LAND_WIDTH = 20;
export const WORLDS_OFFSET_X = -220;

const LAND_LENGTH = 80;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
// TO DO: Texture map the ground
let geometry, plain;
let material = new THREE.MeshPhongMaterial({ color: Colors.green });

export async function createWorldS(scene) {
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
    const sharedTreeModel = await loadTreeModel();
    const treePositions = [
        {x: LAND_BEGIN_X + WORLDS_OFFSET_X + 5, y: 10, z: -5},
        {x: LAND_BEGIN_X + WORLDS_OFFSET_X + 50, y: 10, z: -5},
    ];

    treePositions.forEach(position => {
        let treeModel = sharedTreeModel.clone();
        treeModel.scale.set(20, 20, 20);
        treeModel.traverse((child) => {
            if (child.isMesh) {
                child.raycast = function () {};
            }
        });
        treeModel.position.set(0, -18, 0);
        let tree = new Tree();
        tree.mesh.position.set(position.x, position.y, position.z);
        tree.mesh.scale.set(0.3, 0.3, 0.3);
        scene.add(tree.mesh);
        tree.mesh.add(treeModel);
    });
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
