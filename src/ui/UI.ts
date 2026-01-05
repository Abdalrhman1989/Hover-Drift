export class UI {
    private container: HTMLDivElement;
    private scoreElement: HTMLDivElement;
    private messageElement: HTMLDivElement;
    private titleElement: HTMLDivElement;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'ui-container';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none'; // Let clicks pass through to game if needed, but screens might need pointer events
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.fontFamily = 'monospace';
        this.container.style.userSelect = 'none';
        document.body.appendChild(this.container);

        // Title
        this.titleElement = document.createElement('div');
        this.titleElement.innerText = 'HOVER DRIFT';
        this.titleElement.style.fontSize = '64px';
        this.titleElement.style.color = '#00ffff';
        this.titleElement.style.textShadow = '0 0 20px #00ffff';
        this.titleElement.style.marginBottom = '20px';
        this.titleElement.style.transition = 'opacity 0.5s';
        this.container.appendChild(this.titleElement);

        // Message (Start / Game Over)
        this.messageElement = document.createElement('div');
        this.messageElement.innerText = 'CLICK TO START';
        this.messageElement.style.fontSize = '24px';
        this.messageElement.style.color = 'white';
        this.messageElement.style.animation = 'pulse 1s infinite alternate';
        this.container.appendChild(this.messageElement);

        // Score HUD
        this.scoreElement = document.createElement('div');
        this.scoreElement.innerText = '000000';
        this.scoreElement.style.position = 'absolute';
        this.scoreElement.style.top = '20px';
        this.scoreElement.style.left = '20px';
        this.scoreElement.style.color = 'white';
        this.scoreElement.style.fontSize = '24px';
        this.scoreElement.style.fontWeight = 'bold';
        this.scoreElement.style.textShadow = '0 0 10px #00ffff';
        this.scoreElement.style.display = 'none'; // Hide initially
        document.body.appendChild(this.scoreElement);

        // Add pulse animation style
        const style = document.createElement('style');
        style.innerHTML = `
      @keyframes pulse {
        from { opacity: 0.5; }
        to { opacity: 1; }
      }
    `;
        document.head.appendChild(style);
    }

    showStartScreen() {
        this.container.style.display = 'flex';
        this.titleElement.innerText = 'HOVER DRIFT';
        this.titleElement.style.display = 'block';
        this.messageElement.innerText = 'CLICK TO START';
        this.scoreElement.style.display = 'none';
    }

    showGameUI() {
        this.container.style.display = 'none';
        this.scoreElement.style.display = 'block';
    }

    showGameOver(score: number) {
        this.container.style.display = 'flex';
        this.titleElement.innerText = 'GAME OVER';
        this.titleElement.style.color = '#ff0000';
        this.titleElement.style.textShadow = '0 0 20px #ff0000';
        this.messageElement.innerHTML = `SCORE: ${Math.floor(score)}<br><br>CLICK TO RESTART`;
        this.scoreElement.style.display = 'none';
    }

    updateScore(score: number) {
        this.scoreElement.innerText = Math.floor(score).toString().padStart(6, '0');
    }
}
