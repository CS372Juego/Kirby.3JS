import * as THREE from 'three';
import { Tree, Door, loadTreeModel, loadDoorModel } from '../structure.js';

const LAND_WIDTH = 20;
export const WORLDS_OFFSET_X = -220;

const LAND_LENGTH = 80;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
const loader = new THREE.TextureLoader();
const textureTop = loader.load('src/assets/texture/grass.png');
const textureSides = loader.load('src/assets/texture/darkdirt.png');

textureTop.wrapS = textureTop.wrapT = THREE.RepeatWrapping;
textureSides.wrapS = textureSides.wrapT = THREE.RepeatWrapping;

const blockDimensionsList = [
    { width: LAND_LENGTH-15, height: 30, depth: LAND_WIDTH, x: 2.5, y: -10, z: 0},
    { width: 70, height: 70, depth: LAND_WIDTH, x: LAND_BEGIN_X-LAND_OFFSET-25, y: 10, z: 0},
    { width: 5, height: 70, depth: LAND_WIDTH, x: LAND_END_X+LAND_OFFSET-2.5, y: 10, z: 0}
];

/**
 * Creates the world scene with appropriately configured blocks and trees.
 * @param {THREE.Scene} scene - The scene to add the world to.
 * @returns {Promise<void>} - A promise that resolves when the world is created.
 */
export async function createWorldS(scene) {
    let world = new THREE.Group();

    blockDimensionsList.forEach(({ width, height, depth, x, y, z }) => {
        const repeatXT = width / 10;
        const repeatZT = depth / 20;
        const repeatXS = width / 20;
        const repeatYS = height / 20;

        const topTexture = textureTop.clone();
        topTexture.repeat.set(repeatXT, repeatZT);
        topTexture.needsUpdate = true;

        const sideTexture = textureSides.clone();
        sideTexture.repeat.set(repeatXS, repeatYS);
        sideTexture.needsUpdate = true;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const materials = [
            new THREE.MeshPhongMaterial({ map: sideTexture }),
            new THREE.MeshPhongMaterial({ map: sideTexture }),
            new THREE.MeshPhongMaterial({ map: topTexture }),
            new THREE.MeshPhongMaterial({ map: sideTexture }),
            new THREE.MeshPhongMaterial({ map: sideTexture }),
            new THREE.MeshPhongMaterial({ map: sideTexture })
        ];

        const block = new THREE.Mesh(geometry, materials);
        block.castShadow = true;
        block.receiveShadow = true;
        block.position.set(x, y, z);
        world.add(block);
    });

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

    //=====< Door >=====//
    let doorModel = await loadDoorModel();
    doorModel.scale.set(2, 2, 2);
    doorModel.position.set(-4, -3, 24);
    doorModel.rotation.y = Math.PI/2;

    const door = new Door();
    door.mesh.position.set(LAND_END_X + WORLDS_OFFSET_X + 8, 6, 0);
    door.mesh.rotation.y = Math.PI/2;
    door.mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(door.mesh);
    door.mesh.add(doorModel);
}
