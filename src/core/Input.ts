export class Input {
    public keys: { [key: string]: boolean } = {};

    constructor() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    private onKeyDown(event: KeyboardEvent) {
        this.keys[event.code] = true;
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keys[event.code] = false;
    }

    public isDown(code: string): boolean {
        return !!this.keys[code];
    }

    public get horizontal(): number {
        let x = 0;
        if (this.isDown('KeyA') || this.isDown('ArrowLeft')) x -= 1;
        if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1;
        return x;
    }
}
