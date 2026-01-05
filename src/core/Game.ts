import { Loop } from './Loop';
import { Time } from './Time';
import { Input } from './Input';
import { World } from '../scene/World';
import { Lights } from '../scene/Lights';
import { Track } from '../entities/Track';
import { Player } from '../entities/Player';

import { Spawner } from '../systems/Spawner';
import { Collision } from '../systems/Collision';
import { Score } from '../systems/Score';
import { UI } from '../ui/UI';
import { LevelManager } from '../systems/LevelManager';
import { AudioController } from './Audio'; // Import Audio
import * as THREE from 'three';

export class Game {
    public loop: Loop;
    public time: Time;
    public input: Input;
    public world: World;
    private track: Track;
    private player: Player;
    private spawner: Spawner;
    private collision: Collision;
    private score: Score;
    private ui: UI;
    private levelManager: LevelManager;
    private audio: AudioController; // Engine sound

    private isPlaying: boolean = false;
    private isGameOver: boolean = false;

    constructor() {
        this.time = new Time();
        this.input = new Input();
        this.world = new World();
        new Lights(this.world.scene); // Add lights but don't store ref
        this.levelManager = new LevelManager();
        this.track = new Track(this.world.scene, this.levelManager);
        this.player = new Player(this.input);
        this.world.scene.add(this.player.mesh);
        this.spawner = new Spawner(this.world.scene);
        this.collision = new Collision(this.player, this.spawner);
        this.score = new Score();
        this.ui = new UI();
        this.audio = new AudioController();

        // Bind update so 'this' definition is correct
        this.loop = new Loop(() => this.update());

        // Initial Start Screen
        this.ui.showStartScreen();
        // Update World colors for initial level
        this.applyLevelConfig();

        // Click listener for start/restart
        window.addEventListener('click', () => this.handleGlobalClick());
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') this.handleGlobalClick();
        });

        console.log('Game core initialized');
    }

    start() {
        this.loop.start();
    }

    private handleGlobalClick() {
        if (!this.isPlaying && !this.isGameOver) {
            this.startGame();
        } else if (this.isGameOver) {
            this.restartGame();
        }
    }

    private startGame() {
        this.isPlaying = true;
        this.isGameOver = false;
        this.ui.showGameUI();
        this.time.tick();
        this.audio.resume(); // Resume Audio Context
    }

    private restartGame() {
        window.location.reload();
    }

    private applyLevelConfig() {
        const config = this.levelManager.config;
        // Update fog
        this.world.scene.fog = new THREE.FogExp2(config.fogColor, 0.02);
        this.world.scene.background = new THREE.Color(config.fogColor);
    }

    update() {
        this.time.tick();
        const delta = this.time.delta;

        if (this.isPlaying && !this.isGameOver) {
            const speed = this.levelManager.config.speed;

            // Dynamic FOV (Speed Effect)
            // Base 75, Max 100
            const targetFOV = 75 + (speed - 20) * 0.5;
            this.world.camera.instance.fov = THREE.MathUtils.lerp(this.world.camera.instance.fov, targetFOV, delta);
            this.world.camera.instance.updateProjectionMatrix();

            this.track.update(delta, speed);
            this.player.update(delta);
            this.spawner.update(delta, speed);
            this.score.update(delta);
            this.ui.updateScore(this.score.value);

            // Check Level Up
            if (this.levelManager.update(this.score.value)) {
                this.applyLevelConfig();
                this.audio.playLevelUp();
                // TODO: Floating Text for Level Up
                console.log("Level Up! " + this.levelManager.config.name);
            }

            if (this.collision.check()) {
                this.audio.playCrash();
                this.gameOver();
            }

            // Check Pickups
            this.checkPickups();
        } else {
            this.player.mesh.rotation.y += delta * 0.5;
        }

        this.world.render();
    }

    private checkPickups() {
        const playerBox = new THREE.Box3().setFromObject(this.player.mesh);
        for (const p of this.spawner.pickups) {
            if (!p.active) continue;
            const pickupBox = new THREE.Box3().setFromObject(p.mesh);
            if (playerBox.intersectsBox(pickupBox)) {
                // Collect
                p.active = false;
                p.mesh.visible = false;
                this.score.value += 50;
                this.audio.playPickup();
                // TODO: Floating Text
            }
        }
    }

    private gameOver() {
        this.isGameOver = true;
        this.isPlaying = false;
        this.ui.showGameOver(this.score.value);
    }
}
