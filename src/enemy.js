import * as THREE from 'three';

export const enemySpeed = 0.02;
const LAND_BEGIN_X = -150; 

export function createEnemy(scene) {
    const enemyGeometry = new THREE.SphereGeometry(2, 32, 16);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);

    enemy.position.set(LAND_BEGIN_X + 135, 7.5, 0);
    scene.add(enemy);

    return enemy;
}
