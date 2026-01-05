import * as THREE from 'three';

export class Pickup {
    public mesh: THREE.Mesh;
    public active: boolean = false;
    public type: 'score' = 'score';

    constructor() {
        // Gold Coin: Cylinder standing mostly up
        const geo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
        geo.rotateX(Math.PI / 2); // Face the camera
        const mat = new THREE.MeshStandardMaterial({
            color: 0xffd700, // Gold
            roughness: 0.3,
            metalness: 1.0,
            emissive: 0xaa6600,
            emissiveIntensity: 0.4
        });
        this.mesh = new THREE.Mesh(geo, mat);

        // Inner detail (optional ring)
        const innerGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 16);
        innerGeo.rotateX(Math.PI / 2);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        this.mesh.add(inner);
        this.mesh.visible = false;
    }

    spawn(z: number, x: number) {
        this.mesh.position.set(x, 1, z);
        this.active = true;
        this.mesh.visible = true;
    }

    update(delta: number, speed: number) {
        if (!this.active) return;

        // Move
        this.mesh.position.z += speed * delta;

        // Rotate
        this.mesh.rotation.y += 2 * delta;
        this.mesh.rotation.z += 1 * delta;

        // Deactivate
        if (this.mesh.position.z > 10) {
            this.active = false;
            this.mesh.visible = false;
        }
    }
}
