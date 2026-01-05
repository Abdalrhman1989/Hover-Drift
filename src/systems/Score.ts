export class Score {
    public value: number = 0;

    constructor() { }

    update(delta: number) {
        this.value += delta * 10; // 10 points per second
    }

    reset() {
        this.value = 0;
    }
}
