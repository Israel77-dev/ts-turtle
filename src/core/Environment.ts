export default class Environment {
  public readonly context: CanvasRenderingContext2D;
  public readonly width: number;
  public readonly height: number;

  constructor(canvas: HTMLCanvasElement, backgroundColor?: string) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");

    const previousFill = this.context.fillStyle;
    this.context.fillStyle = backgroundColor || "black";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = previousFill;
  }
}
