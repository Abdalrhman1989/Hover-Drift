import * as THREE from 'three';
import { Obstacle } from '../entities/Obstacle';
import { Pickup } from '../entities/Pickup';

export class Spawner {
    private scene: THREE.Scene;
    public obstacles: Obstacle[] = [];
    public pickups: Pickup[] = [];
    private spawnTimer: number = 0;
    // private spawnInterval: number = 1.5; // Calculated dynamically now

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        // Obstacles
        for (let i = 0; i < 10; i++) {
            const obs = new Obstacle();
            obs.active = false;
            obs.mesh.visible = false;
            this.scene.add(obs.mesh);
            this.obstacles.push(obs);
        }
        // Pickups
        for (let i = 0; i < 5; i++) {
            const p = new Pickup();
            p.active = false;
            p.mesh.visible = false;
            this.scene.add(p.mesh);
            this.pickups.push(p);
        }
    }

    update(delta: number, speed: number) {
        this.spawnTimer += delta;
        // Spawn faster as speed increases
        // Base interval decreased to 30/speed (was 40)
        // Min interval 0.4s (was 0.5)
        const interval = Math.max(0.4, 30 / speed);

        if (this.spawnTimer >= interval) {
            this.spawnTimer = 0;
            this.spawn();
        }

        // Update active
        for (const obs of this.obstacles) {
            if (obs.active) obs.update(delta, speed); // Pass speed to obstacle
        }
        for (const p of this.pickups) {
            if (p.active) p.update(delta, speed);
        }
    }

    private spawn() {
        const x = (Math.random() - 0.5) * 16;

        // 30% chance for pickup (Gold), 70% obstacle
        if (Math.random() < 0.3) {
            const p = this.pickups.find(i => !i.active);
            if (p) p.spawn(-100, x);
        } else {
            const obs = this.obstacles.find(o => !o.active);
            if (obs) obs.spawn(-100, x);
        }
    }
}
