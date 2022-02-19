import { Subject } from "rxjs";
import { Point2D, Vec2D } from "../utils/math";
import { EnvironmentUpdate } from "./API/OutputAPI";

/**
 * Object for keeping the information about the environment the turtle lives in.
 * Currently mainly used for background color and matrix transformations.
 */
export default class Environment {
  private _output: Subject<EnvironmentUpdate>;
  private _width: number;
  private _height: number;

  private _backgroundColor: string;

  constructor(
    outputStream: Subject<EnvironmentUpdate>,
    width?: number,
    height?: number,
    backgroundColor?: string
  ) {
    this._width = width || 768;
    this._height = height || 400;
    this._backgroundColor = backgroundColor || "black";

    this._output = outputStream;
  }

  /**
   * Width of drawing canvas.
   */
  get width() {
    return this._width;
  }

  /**
   * Height of drawing canvas
   */
  get height() {
    return this._height;
  }

  /**
   * Background color of the canvas
   */
  get backgroundColor() {
    return this._backgroundColor;
  }

  /**
   * Background color of the canvas
   */
  set backgroundColor(color) {
    this._backgroundColor = color;
    this._output.next({
      from: "Environment",
      type: "backgroundColor",
      data: {
        color: this._backgroundColor,
      },
    });
  }

  /**
   * Transforms the turtle position (or any other vector) from the standard cartesian space
   * to the representation on the canvas.
   * @param position Turtle position in standard coordinates
   * @returns Turtle position adjusted to the current canvas
   */
  transform(position: Point2D): Vec2D {
    return Vec2D.fromPoint({
      x: position.x + this.width / 2,
      y: this.height / 2 - position.y,
    });
  }
}
