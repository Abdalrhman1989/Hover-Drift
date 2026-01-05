import * as THREE from 'three';
import { Camera } from './Camera';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class World {
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public camera: Camera;
    private composer: EffectComposer;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050510); // Dark futuristic blue
        this.scene.fog = new THREE.FogExp2(0x050510, 0.02);

        this.camera = new Camera();

        this.renderer = new THREE.WebGLRenderer({
            antialias: false, // Antialias sometimes conflicts with PP/Performance
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true; // Enable shadows

        document.getElementById('app')?.appendChild(this.renderer.domElement);

        // Post Processing
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera.instance));

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);

        window.addEventListener('resize', () => this.resize());
    }

    private resize() {
        this.camera.resize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.composer.render();
    }
}
