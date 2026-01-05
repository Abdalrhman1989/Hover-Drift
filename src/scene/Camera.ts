import * as THREE from 'three';

export class Camera {
    public instance: THREE.PerspectiveCamera;

    constructor() {
        this.instance = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.instance.position.set(0, 3, 6);
        this.instance.lookAt(0, 0, 0);
    }

    resize() {
        this.instance.aspect = window.innerWidth / window.innerHeight;
        this.instance.updateProjectionMatrix();
    }
}
