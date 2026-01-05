export class Loop {
    private updateFn: () => void;
    private id: number = 0;
    private isRunning: boolean = false;

    constructor(updateFn: () => void) {
        this.updateFn = updateFn;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.id);
    }

    private animate = () => {
        if (!this.isRunning) return;
        this.id = requestAnimationFrame(this.animate);
        this.updateFn();
    };
}
