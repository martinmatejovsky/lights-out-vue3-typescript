export class Range {
  min: number;
  max: number;

  public get length(): number {
    return this.max - this.min;
  }

  generateRandom(): number {
    return Math.floor(Math.random() * (this.max + 1 - this.min) + this.min);
  }

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
}
