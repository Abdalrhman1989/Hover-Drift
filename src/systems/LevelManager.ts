export type EnvironmentType = 'city' | 'crystals' | 'data_core';

export interface LevelConfig {
    name: string;
    speed: number;
    color: number;
    fogColor: number;
    environment: EnvironmentType;
}

export class LevelManager {
    public currentLevel: number = 0;
    public levels: LevelConfig[] = [
        { name: "Neon City", speed: 30, color: 0x00ffff, fogColor: 0x050510, environment: 'city' },
        { name: "Crystal Peaks", speed: 50, color: 0xff00ff, fogColor: 0x220022, environment: 'crystals' },
        { name: "Data Core", speed: 70, color: 0xffaa00, fogColor: 0x221100, environment: 'data_core' },
        { name: "The Void", speed: 90, color: 0xffffff, fogColor: 0x000000, environment: 'city' } // Bonus Hard Level
    ];

    public get config(): LevelConfig {
        return this.levels[this.currentLevel];
    }

    update(score: number): boolean {
        // Faster Level Up: Every 300 points
        const newLevel = Math.min(Math.floor(score / 300), this.levels.length - 1);

        if (newLevel !== this.currentLevel) {
            this.currentLevel = newLevel;
            return true; // Level changed
        }
        return false;
    }

    reset() {
        this.currentLevel = 0;
    }
}
