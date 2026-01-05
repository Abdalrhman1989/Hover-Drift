import * as THREE from 'three';
import { EnvironmentType } from '../systems/LevelManager';

export class TrackSegment {
    public mesh: THREE.Group;
    private size: number;
    private env: EnvironmentType;
    private envMeshes: THREE.Mesh[] = [];

    constructor(size: number, zPosition: number, env: EnvironmentType) {
        this.size = size;
        this.env = env;
        this.mesh = new THREE.Group();

        // Floor
        const geometry = new THREE.PlaneGeometry(20, size);
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.mesh.add(floor);

        // Side Rails (Neon)
        const railGeo = new THREE.BoxGeometry(0.5, 1, size);
        const railMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 0.5
        });

        const leftRail = new THREE.Mesh(railGeo, railMat);
        leftRail.position.set(-10, 0.5, 0);
        this.mesh.add(leftRail);

        const rightRail = new THREE.Mesh(railGeo, railMat);
        rightRail.position.set(10, 0.5, 0);
        this.mesh.add(rightRail);

        // -- Environment: Side Buildings --
        this.generateEnvironment();

        // Initial Position
        this.mesh.position.z = zPosition;
    }

    private generateEnvironment() {
        if (this.env === 'city') {
            const buildingMat = new THREE.MeshStandardMaterial({
                color: 0x111118,
                roughness: 0.1,
                metalness: 0.8,
                emissive: 0x110022,
                emissiveIntensity: 0.2
            });
            this.createBuildings(-15, buildingMat);
            this.createBuildings(15, buildingMat);
        } else if (this.env === 'crystals') {
            const crystalMat = new THREE.MeshStandardMaterial({
                color: 0xff00ff,
                roughness: 0.1,
                metalness: 0.9,
                emissive: 0xff00ff,
                emissiveIntensity: 0.5
            });
            this.createCrystals(-12, crystalMat);
            this.createCrystals(12, crystalMat);
        } else if (this.env === 'data_core') {
            const dataMat = new THREE.MeshStandardMaterial({
                color: 0xffaa00,
                roughness: 0.3,
                metalness: 1.0,
                emissive: 0xff4400,
                emissiveIntensity: 0.8,
                wireframe: true
            });
            this.createDataArches(dataMat);
        }
    }

    private createBuildings(xOffset: number, material: THREE.MeshStandardMaterial) {
        for (let i = 0; i < 2; i++) {
            const height = 5 + Math.random() * 15;
            const width = 2 + Math.random() * 3;
            const geo = new THREE.BoxGeometry(width, height, width);
            const mesh = new THREE.Mesh(geo, material);
            const z = (Math.random() - 0.5) * this.size;
            mesh.position.set(xOffset + (Math.random() * 5), height / 2, z);
            this.mesh.add(mesh);
        }
    }

    private createCrystals(xOffset: number, material: THREE.MeshStandardMaterial) {
        for (let i = 0; i < 3; i++) {
            const radius = 1 + Math.random() * 2;
            const height = 3 + Math.random() * 8;
            const geo = new THREE.ConeGeometry(radius, height, 4); // Pyramids
            const mesh = new THREE.Mesh(geo, material);
            const z = (Math.random() - 0.5) * this.size;
            mesh.position.set(xOffset + (Math.random() * 2), height / 2, z);
            // Random rotation
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.x = (Math.random() - 0.5) * 0.5;
            this.mesh.add(mesh);
            this.envMeshes.push(mesh);
        }
    }

    private createDataArches(material: THREE.MeshStandardMaterial) {
        // Create an arch over the track
        if (Math.random() > 0.5) return; // Only some segments have arches

        const torusGeo = new THREE.TorusGeometry(12, 0.5, 8, 20, Math.PI);
        const mesh = new THREE.Mesh(torusGeo, material);
        mesh.position.set(0, 0, 0); // Center of segment
        mesh.rotation.z = Math.PI; // Arch over
        // mesh.scale.y = 1.5;
        this.mesh.add(mesh);
        this.envMeshes.push(mesh);
    }

    update(delta: number) {
        if (this.env === 'crystals') {
            for (const m of this.envMeshes) {
                m.rotation.y += delta * 0.5;
            }
        } else if (this.env === 'data_core') {
            for (const m of this.envMeshes) {
                m.rotation.z += delta * 0.2;
            }
        }
    }
}
