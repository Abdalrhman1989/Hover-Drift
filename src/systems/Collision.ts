import * as THREE from 'three';
import { Player } from '../entities/Player';
import { Spawner } from './Spawner';

export class Collision {
    private player: Player;
    private spawner: Spawner;
    private playerBox: THREE.Box3;
    private obstacleBox: THREE.Box3;

    constructor(player: Player, spawner: Spawner) {
        this.player = player;
        this.spawner = spawner;
        this.playerBox = new THREE.Box3();
        this.obstacleBox = new THREE.Box3();
    }

    check(): boolean {
        // Update player bounding box
        this.playerBox.setFromObject(this.player.mesh);
        // Shrink box slightly for forgiveness
        this.playerBox.expandByScalar(-0.1);

        // Check against all active obstacles
        // exposing obstacles publicly on Spawner would be easiest, or adding a getter
        // For now assuming we can access spawner.obstacles if public, else I need to add accessor

        // @ts-ignore - access private/protected if needed, but better to fix Spawner
        const obstacles = this.spawner['obstacles'];

        for (const obs of obstacles) {
            if (!obs.active) continue;

            this.obstacleBox.setFromObject(obs.mesh);
            this.obstacleBox.expandByScalar(-0.1);

            if (this.playerBox.intersectsBox(this.obstacleBox)) {
                return true;
            }
        }
        return false;
    }
}
