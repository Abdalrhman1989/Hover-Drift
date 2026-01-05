import * as THREE from 'three';
import { TrackSegment } from './TrackSegment';
import { LevelManager } from '../systems/LevelManager';

export class Track {
    private scene: THREE.Scene;
    private levelManager: LevelManager;
    private segments: TrackSegment[] = [];
    private segmentSize: number = 20; // Length of each segment
    private segmentCount: number = 10; // Number of visible segments
    // private speed: number = 20; // Controlled by Game/LevelManager now

    constructor(scene: THREE.Scene, levelManager: LevelManager) {
        this.scene = scene;
        this.levelManager = levelManager;
        this.init();
    }

    private init() {
        for (let i = 0; i < this.segmentCount; i++) {
            // Force City for initial segments to avoid pop-in issues or just use current
            this.spawnSegment(-i * this.segmentSize);
        }
    }

    private spawnSegment(z: number) {
        // Determine environment based on current level
        const env = this.levelManager.config.environment;
        const segment = new TrackSegment(this.segmentSize, z, env);
        this.scene.add(segment.mesh);
        this.segments.push(segment);
    }

    update(delta: number, speed: number) {
        // Move segments towards camera (positive Z)
        const moveDistance = speed * delta;

        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            segment.update(delta); // Animate environment
            segment.mesh.position.z += moveDistance;

            // Recycle if behind camera
            if (segment.mesh.position.z > 20) {
                // We can't just move it back if we want to change biome visuals
                // We need to either update the mesh or replace it.
                // Replacing is safer for distinct geometries.

                const furthestZ = this.getFurthestZ();
                const newZ = furthestZ - this.segmentSize;

                // Remove old
                this.scene.remove(segment.mesh);
                // Splice out
                this.segments.splice(i, 1);

                // Add new
                this.spawnSegment(newZ);
            }
        }

        // Optional: Sort segments to keep order? Not strictly needed for logic if we recycle.
    }

    private getFurthestZ(): number {
        let minZ = Infinity;
        for (const seg of this.segments) {
            if (seg.mesh.position.z < minZ) {
                minZ = seg.mesh.position.z;
            }
        }
        return minZ;
    }
}
