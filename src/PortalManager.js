import { Portal } from './portal.js';

class PortalManager {
    constructor(scene) {
        this.scene = scene;
        this.portals = [];
    }

    addPortal(portalPosition, teleportPosition, orientationCheck = true) {
        const portal = new Portal(teleportPosition, orientationCheck);
        portal.mesh.position.copy(portalPosition);
        portal.addToScene(this.scene);
        this.portals.push(portal);
    }

    checkPortals(kirby, keyState) {
        for (const portal of this.portals) {
            if (portal.checkTeleport(kirby, keyState)) {
                // handle additional logic after the teleport
                break;
            }
        }
    }
}

export { PortalManager };
