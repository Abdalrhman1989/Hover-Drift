import * as THREE from 'three';

export class Obstacle {
    public mesh: THREE.Mesh;
    public active: boolean = true;

    constructor() {
        // Simple Box Obstacle
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            emissive: 0xaa0000,
            emissiveIntensity: 0.8,
            roughness: 0.4
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    spawn(z: number, x: number) {
        this.mesh.position.set(x, 1, z);
        this.active = true;
        this.mesh.visible = true;
    }

    update(delta: number, speed: number) {
        if (!this.active) return;

        // Move towards camera
        this.mesh.position.z += speed * delta;

        // Rotation (Dynamic Obstacles)
        this.mesh.rotation.x += delta;
        this.mesh.rotation.y += delta * 0.5;

        // Deactivate if behind camera
        if (this.mesh.position.z > 10) {
            this.active = false;
            this.mesh.visible = false;
        }
    }
}
