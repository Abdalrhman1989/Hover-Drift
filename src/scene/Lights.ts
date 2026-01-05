import * as THREE from 'three';

export class Lights {
    private scene: THREE.Scene;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.setupLights();
    }

    private setupLights() {
        // Ambient light - low intensity
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);

        // Directional light - like a sun or moon
        const dirLight = new THREE.DirectionalLight(0xaaccff, 1.5);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        // Grid helper for reference (temporary)
        const grid = new THREE.GridHelper(100, 100, 0x00ffff, 0x222222);
        this.scene.add(grid);
    }
}
