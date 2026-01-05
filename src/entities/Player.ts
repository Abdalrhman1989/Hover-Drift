import * as THREE from 'three';
import { Input } from '../core/Input';

export class Player {
    public mesh: THREE.Group;
    private input: Input;
    private targetX: number = 0;
    private currentX: number = 0;
    private speed: number = 15; // Lateral speed responsiveness
    private tilt: number = 0; // Current tilt angle

    private readonly MAX_X = 8; // Limit movement range

    constructor(Input: Input) {
        this.input = Input;
        this.mesh = new THREE.Group();

        // -- "Rocket" Design (Retro-Futuristic) --

        // 1. Fuselage (Main Body)
        const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.0, 16);
        bodyGeo.rotateX(Math.PI / 2); // Point forward (Z)
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc, // Silver/White
            roughness: 0.3,
            metalness: 0.8
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        this.mesh.add(body);

        // 2. Nose Cone
        const noseGeo = new THREE.ConeGeometry(0.5, 1.0, 16);
        noseGeo.rotateX(-Math.PI / 2); // Point towards -Z
        noseGeo.translate(0, 0, -2); // Front (Negative Z)
        const noseMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.2,
            metalness: 0.5
        });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        this.mesh.add(nose);

        // 3. Fins (4 Rear Fins)
        const finGeo = new THREE.BoxGeometry(1.2, 0.1, 1.0);
        const finMat = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            roughness: 0.5,
            metalness: 0.2
        });

        // Top Fin
        const finTop = new THREE.Mesh(finGeo, finMat);
        finTop.rotation.z = Math.PI / 2;
        finTop.position.set(0, 0.5, 1); // Rear (Positive Z)
        this.mesh.add(finTop);

        // Bottom Fin
        const finBottom = new THREE.Mesh(finGeo, finMat);
        finBottom.rotation.z = Math.PI / 2;
        finBottom.position.set(0, -0.5, 1);
        this.mesh.add(finBottom);

        // Left Fin
        const finLeft = new THREE.Mesh(finGeo, finMat);
        finLeft.position.set(-0.5, 0, 1);
        this.mesh.add(finLeft);

        // Right Fin
        const finRight = new THREE.Mesh(finGeo, finMat);
        finRight.position.set(0.5, 0, 1);
        this.mesh.add(finRight);

        // 4. Porthole Window
        const windowGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
        windowGeo.rotateX(Math.PI / 2);
        const windowMesh = new THREE.Mesh(windowGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff }));
        windowMesh.position.set(0, 0.45, -1.0); // Forward (Negative Z)
        windowMesh.rotation.x = -Math.PI / 2;
        this.mesh.add(windowMesh);

        // 5. Main Thruster (Flame)
        const glowGeo = new THREE.ConeGeometry(0.3, 1.5, 8);
        glowGeo.rotateX(Math.PI / 2); // Point Back (Positive Z)
        glowGeo.translate(0, 0, 2.0); // Rear
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.8
        });
        const thruster = new THREE.Mesh(glowGeo, glowMat);
        this.mesh.add(thruster);

        // Initial position
        this.mesh.position.y = 1; // Hover height
        this.mesh.position.z = 0; // Fixed Z
    }

    update(delta: number) {
        // Get input
        const inputX = this.input.horizontal;

        // Calculate target position
        // We update targetX based on input, but clamp it
        this.targetX += inputX * this.speed * delta;
        this.targetX = Math.max(-this.MAX_X, Math.min(this.MAX_X, this.targetX));

        // Smoothly interpolate currentX to targetX (Simple Lerp)
        // Actually, simple input-based movement:
        // If key is held, move towards direction.
        // Let's make it direct control with easing.

        // Option B: Input sets velocity.
        // Option C: Input sets target position relative to current? 
        // Let's stick to: Press A -> Slide Left.

        if (inputX !== 0) {
            this.currentX += inputX * this.speed * delta;
        }

        // Friction / Restoration if we wanted "lanes", but here it's free drift
        // Clamp
        this.currentX = Math.max(-this.MAX_X, Math.min(this.MAX_X, this.currentX));

        // Apply position
        this.mesh.position.x = this.currentX;

        // Calculate Tilt based on movement direction
        // If moving left, tilt left (rotate Z)
        const targetTilt = -inputX * 0.5; // Max 0.5 rad tilt

        // Smooth tilt
        this.tilt += (targetTilt - this.tilt) * 10 * delta;
        this.mesh.rotation.z = this.tilt;

        // Hover bobbing
        this.mesh.position.y = 1 + Math.sin(Date.now() * 0.005) * 0.1;
    }
}
