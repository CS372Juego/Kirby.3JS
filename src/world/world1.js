import * as THREE from 'three';
import { Tree, Spikes, StarBox, Door, loadTreeModel, loadDoorModel } from '../structure.js';

const LAND_WIDTH = 20;
export const LAND_LENGTH = 300;
export const LAND_OFFSET = 15;
export const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
export const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

// Global variables for reuse
const loader = new THREE.TextureLoader();
const textureTop = loader.load('../assets/texture/grass.png');
const textureSides = loader.load('../assets/texture/darkdirt.png');

textureTop.wrapS = textureTop.wrapT = THREE.RepeatWrapping;
textureSides.wrapS = textureSides.wrapT = THREE.RepeatWrapping;

const blockDimensionsList = [
    { width: LAND_LENGTH, height: 50, depth: LAND_WIDTH, x: 10, y: -20, z: 0.01 },
    { width: 40, height: 90, depth: LAND_WIDTH, x: LAND_BEGIN_X - LAND_OFFSET - 10, y: 0, z: 0 },
    { width: 10, height: 12, depth: LAND_WIDTH, x: LAND_BEGIN_X + 10.1, y: 3, z: 0.01, zPriority: -1 },
    { width: 20, height: 5, depth: LAND_WIDTH, x: LAND_BEGIN_X + 23.5, y: 3, z: 0, rotation: -Math.PI / 8, zPriority: -1 },
    { width: 5, height: 10, depth: LAND_WIDTH, x: LAND_BEGIN_X + 50, y: 5, z: 0 },
    { width: 5, height: 20, depth: LAND_WIDTH, x: LAND_BEGIN_X + 54.9, y: 5, z: 0 },
    { width: 20, height: 20, depth: LAND_WIDTH, x: LAND_BEGIN_X + 80, y: 5, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X + 110, y: 14, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X + 130, y: 14, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X + 150, y: 14, z: 0 },
    { width: 20, height: 20, depth: LAND_WIDTH, x: LAND_BEGIN_X + 180, y: 5, z: 0, zPriority: 0 },
    { width: 20, height: 10, depth: LAND_WIDTH, x: LAND_BEGIN_X + 197, y: 6.4, z: 0, rotation: -Math.PI / 8, zPriority: -1 },
    { width: 30, height: 12, depth: LAND_WIDTH, x: LAND_BEGIN_X + 210, y: 3, z: 0, zPriority: -2 },
    { width: 20, height: 5, depth: LAND_WIDTH, x: LAND_BEGIN_X + 233, y: 3, z: 0, rotation: -Math.PI / 8, zPriority: -1 },
    { width: 40, height: 90, depth: LAND_WIDTH, x: LAND_END_X + LAND_OFFSET + 10, y: 0, z: 0.00}
];

/**
 * Creates World 1 in the scene.
 * 
 * @param {THREE.Scene} scene - The scene in which to create World 1.
 * @returns {Promise<void>} - A promise that resolves when World 1 is created.
 */
export async function createWorld1(scene) {
    let world1 = new THREE.Group();

    blockDimensionsList.forEach(({ width, height, depth, x, y, z, rotation, zPriority }) => {
        const repeatXT = width / 10;
        const repeatZT = depth / 20;
        const repeatXS = width / 20;
        const repeatYS = height / 20;

        if(zPriority === undefined) {
            zPriority = 0;
        }

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
        block.position.set(x, y, z);
        if (rotation) block.rotation.z = rotation;
        block.castShadow = true;
        block.receiveShadow = true;
        block.position.z += zPriority*0.005;
        world1.add(block);
    });

    scene.add(world1);

    //=====< Trees >=====//
    const sharedTreeModel = await loadTreeModel();
    const treePositions = [
        {x: LAND_BEGIN_X + 10, y: 15, z: -5},
        {x: LAND_BEGIN_X + 180, y: 20, z: -5},
        {x: LAND_BEGIN_X + 250, y: 10, z: -5},
        {x: LAND_BEGIN_X + 265, y: 10, z: -5},
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

    //=====< Star Box >=====//
    let starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 92.5, 7.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 92.5, 7.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 92.5, 7.5, 5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 120.5, 7.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 120.5, 7.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 120.5, 7.5, 5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 167.5, 7.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 167.5, 7.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 167.5, 7.5, 5);
    scene.add(starBox.mesh);
    starBox = new StarBox();

    starBox.mesh.position.set(LAND_BEGIN_X + 207, 11.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 212, 11.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 217, 11.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 207, 16.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 212, 16.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 207, 11.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 212, 11.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X + 217, 11.5, 0);
    scene.add(starBox.mesh);

    //=====< Door >=====//
    let doorModel = await loadDoorModel();
    doorModel.scale.set(2, 2, 2);
    doorModel.position.set(-4, -3, 24);
    doorModel.rotation.y = Math.PI/2;
    doorModel.traverse((child) => {
        if (child.isMesh) {
            child.raycast = function () {};
        }
    });
    const door = new Door();
    door.mesh.position.set(LAND_BEGIN_X + LAND_LENGTH - 27, 6, 0);
    door.mesh.rotation.y = Math.PI/2;
    door.mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(door.mesh);
    door.mesh.add(doorModel);

    let anotherDoorModel = await loadDoorModel();
    anotherDoorModel.scale.set(2, 2, 2);
    anotherDoorModel.position.set(-4, -3, 24);
    anotherDoorModel.rotation.y = Math.PI/2;
    anotherDoorModel.traverse((child) => {
        if (child.isMesh) {
            child.raycast = function () {};
        }
    });
    const anotherDoor = new Door();
    anotherDoor.mesh.position.set(LAND_BEGIN_X-5.5, 6, 0);
    anotherDoor.mesh.rotation.y = Math.PI/2;
    anotherDoor.mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(anotherDoor.mesh);
    anotherDoor.mesh.add(anotherDoorModel);
}
