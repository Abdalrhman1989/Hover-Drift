import * as THREE from 'three';

export class Time {
    private clock: THREE.Clock;
    public delta: number = 0;
    public elapsed: number = 0;

    constructor() {
        this.clock = new THREE.Clock();
    }

    tick() {
        this.delta = this.clock.getDelta();
        this.elapsed = this.clock.getElapsedTime();
    }
}
