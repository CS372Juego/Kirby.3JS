import * as THREE from 'three';

export class Portal {
    constructor(teleportPosition, orientationCheck = true) {
        this.geometry = new THREE.BoxGeometry(3, 5, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green for visibility
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.teleportPosition = teleportPosition; // Where Kirby should be teleported to
        this.orientationCheck = orientationCheck; // Whether to check Kirby is facing the portal
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }

    checkTeleport(kirby, keyState) {
        const distance = kirby.position.distanceTo(this.mesh.position);
        const isFacing = this.orientationCheck ? this.isFacingPortal(kirby) : true;

        // Threshold distance and facing check
        if (distance < 2 && keyState['KeyW'] && isFacing) {
            kirby.position.set(this.teleportPosition.x, this.teleportPosition.y, this.teleportPosition.z);
            return true; // Teleported
        }
        return false; // Not teleported
    }

    isFacingPortal(kirby) {
        const dirToPortal = new THREE.Vector3().subVectors(this.mesh.position, kirby.position).normalize();
        const kirbyFacing = new THREE.Vector3(0, 0, -1);
        kirbyFacing.applyQuaternion(kirby.quaternion);

        return dirToPortal.dot(kirbyFacing) > 0.5;
    }
}
