import * as THREE from 'three';
import { Tree, Spikes, StarBox, Door, loadTreeModel, loadDoorModel } from '../src/structure.js';

const LAND_WIDTH = 20;
export const WORLD2_OFFSET_X = 350;

const LAND_LENGTH = 300;
const LAND_OFFSET = 15;
export const LAND_BEGIN_X2 = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

const loader = new THREE.TextureLoader();
const textureTop = loader.load('../../assets/texture/grass.png');
const textureSides = loader.load('../../assets/texture/darkdirt.png');

textureTop.wrapS = textureTop.wrapT = THREE.RepeatWrapping;
textureSides.wrapS = textureSides.wrapT = THREE.RepeatWrapping;

const blockDimensionsList = [
    { width: LAND_LENGTH, height: 50, depth: LAND_WIDTH, x: 0, y: -20, z: 0 },
    { width: 40, height: 90, depth: LAND_WIDTH, x: LAND_BEGIN_X2 - LAND_OFFSET - 10, y: 0, z: 0 },
    { width: 10, height: 20, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 30, y: 5, z: 0 },
    { width: 20, height: 60, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 65, y: 40, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 90, y: 14, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 80, y: 24, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 90, y: 34, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 80, y: 44, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 90, y: 54, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 120, y: 70, z: 0 },
    { width: 50, height: 60, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 120, y: 30, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 165, y: 54, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 150, y: 44, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 165, y: 34, z: 0 },
    { width: 10, height: 3, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 150, y: 24, z: 0 },
    { width: 10, height: 15, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 150, y: 10, z: 0, zPriority: -1 },
    { width: 20, height: 50, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 180, y: 45, z: 0 },
    { width: 30, height: 10, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 170, y: 7, z: 0, zPriority: -4 },
    { width: 20, height: 10, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 182, y: 6.4, z: 0, rotation: Math.PI / 8, zPriority: -3 },
    { width: 20, height: 10, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 197, y: 6.4, z: 0, rotation: -Math.PI / 8, zPriority: -2 },
    { width: 30, height: 12, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 210, y: 3, z: 0, zPriority: -3 },
    { width: 20, height: 5, depth: LAND_WIDTH, x: LAND_BEGIN_X2 + 233, y: 3, z: 0, rotation: -Math.PI / 8, zPriority: -4 },
    { width: 40, height: 50, depth: LAND_WIDTH, x: LAND_END_X + LAND_OFFSET + 10, y: 20, z: 0 }
];

/**
 * Creates World 2 in the scene.
 * 
 * @param {THREE.Scene} scene - The scene to add World 2 to.
 * @returns {Promise<void>} - A promise that resolves when World 2 is created.
 */
export async function createWorld2(scene) {
    let world2 = new THREE.Group();

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
        block.castShadow = true;
        block.receiveShadow = true;
        if (rotation) block.rotation.z = rotation;
        block.position.z += zPriority*0.005;
        world2.add(block);
    });

    world2.position.x = WORLD2_OFFSET_X;
    scene.add(world2);

    //=====< Trees >=====//
    const sharedTreeModel = await loadTreeModel();
    const treePositions = [
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 5, y: 10, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 30, y: 20, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 58, y: 75, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 72, y: 75, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 172, y: 75, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 188, y: 75, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 250, y: 10, z: -5},
        {x: LAND_BEGIN_X2 + WORLD2_OFFSET_X + 265, y: 10, z: -5},
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
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 117.5, 61, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 122.5, 61, 0);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 117.5, 61, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 122.5, 61, -5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 117.5, 61, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);
    spikes = new Spikes();
    spikes.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 122.5, 61, 5);
    spikes.mesh.scale.set(0.3, 0.3, 0.3);
    scene.add(spikes.mesh);

    //=====< Star Box >=====//
    let starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 22.5, 7.5, 0);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 22.5, 7.5, 5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 210.5, 11.5, 5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 210.5, 11.5, -5);
    scene.add(starBox.mesh);
    starBox = new StarBox();
    starBox.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 272.5, 7.5, -6);
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
    door.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X + 273, 6, 0);
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
    anotherDoor.mesh.position.set(LAND_BEGIN_X2 + WORLD2_OFFSET_X-5.5, 6, 0);
    anotherDoor.mesh.rotation.y = Math.PI/2;
    anotherDoor.mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(anotherDoor.mesh);
    anotherDoor.mesh.add(anotherDoorModel);
}
