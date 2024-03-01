import * as THREE from 'three';
import { Tree, Star, Door, loadTreeModel, loadStarModel } from '../src/structure.js';

const LAND_WIDTH = 20;
export const WORLDF_OFFSET_X = 580;

const LAND_LENGTH = 100;
const LAND_OFFSET = 15;
const LAND_BEGIN_X = -LAND_LENGTH / 2 + LAND_OFFSET;
const LAND_END_X = LAND_LENGTH / 2 - LAND_OFFSET;

const loader = new THREE.TextureLoader();
const textureTop = loader.load('../assets/texture/grass.png');
const textureSides = loader.load('../assets/texture/darkdirt.png');

textureTop.wrapS = textureTop.wrapT = THREE.RepeatWrapping;
textureSides.wrapS = textureSides.wrapT = THREE.RepeatWrapping;

const blockDimensionsList = [
    { width: LAND_LENGTH, height: 10, depth: LAND_WIDTH, x: 0, y: 0, z: 0 },
    { width: 40, height: 50, depth: LAND_WIDTH, x: LAND_BEGIN_X - LAND_OFFSET - 10, y: 20, z: 0 },
    { width: 10, height: 50, depth: LAND_WIDTH, x: LAND_END_X + LAND_OFFSET, y: 20, z: 0 }
];

/**
 * Creates the world in the scene.
 * @param {THREE.Scene} scene - The scene where the world will be added.
 * @returns {Promise<void>} - A promise that resolves when the world is created.
 */
export async function createWorldF(scene) {
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
        block.position.set(x, y, z);
        block.castShadow = true;
        block.receiveShadow = true;
        world.add(block);
    });

    world.position.x = WORLDF_OFFSET_X;
    scene.add(world);

    //=====< Trees >=====//
    const sharedTreeModel = await loadTreeModel();
    const treePositions = [
        {x: LAND_BEGIN_X + WORLDF_OFFSET_X + 5, y: 10, z: -5},
        {x: LAND_BEGIN_X + WORLDF_OFFSET_X + 65, y: 10, z: -5},
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

    //=====< Star >=====//
    let star = new Star();
    star.mesh.position.set(LAND_BEGIN_X + WORLDF_OFFSET_X + 35, 20, -5);
    scene.add(star.mesh);

    let starModel = await loadStarModel();
    starModel.scale.set(18, 18, 18);

    starModel.traverse((child) => {
        if (child.isMesh) {
            child.raycast = function () {};
        }
    });
    star.mesh.add(starModel);

    //=====< Door >=====//
    // let door = new Door();
    // door.mesh.position.set(LAND_BEGIN_X + WORLDF_OFFSET_X + 95, 0, 0);
    // scene.add(door.mesh);
}
