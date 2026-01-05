# Hover Drift

A futuristic 3D endless runner built with Three.js and TypeScript.

## Features

- **Endless Track**: Infinite procedural track generation with neon aesthetics.
- **Smooth Controls**: Physics-like hover vehicle movement with smooth interpolation.
- **Visuals**: glowing neon environment, dynamic lighting, and post-processing bloom effects.
- **Game Loop**: Professional game cycle with Start, Play, Score, and Game Over states.
- **Tech Stack**: Built with Three.js, TypeScript, and Vite (No heavy game engines).

## How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Controls

- **A / Left Arrow**: Move Left
- **D / Right Arrow**: Move Right
- **Space / Enter / Click**: Start / Restart

## Architecture

The project follows a clean, modular structure:

- `src/core`: Main game loop, time management, and input handling.
- `src/scene`: World setup, camera, lights, and rendering (Three.js integration).
- `src/entities`: Game objects like Player, Track, and Obstacles.
- `src/systems`: Logic systems for Spawning, Collision, and Scoring.
- `src/ui`: DOM-based UI overlays.

## Embed

To embed in other projects, the game is contained within the `Game` class (`src/core/Game.ts`) and attaches to a DOM element. The `World` class handles the canvas attachment.
