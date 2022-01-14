// TODO: Document this file
import { Subject } from "rxjs";
import { Vec2D } from "../utils/math";

/**
 * Object for keeping the information about the environment the turtle lives in.
 * Currently mainly used for background color and matrix transformations.
 */
export default class Environment {
  private _output: Subject<EnvironmentChanges>;
  private _width: number;
  private _height: number;

  private _backgroundColor: string;
  private _penColor: string;

  constructor(
    outputStream: Subject<EnvironmentChanges>,
    width?: number,
    height?: number,
    backgroundColor?: string,
    penColor?: string
  ) {
    this._width = width || 768;
    this._height = height || 400;
    this._backgroundColor = backgroundColor || "black";
    this._penColor = penColor || "white";

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
    this._output.next("EnvironmentChange.bgColor");
  }

  /**
   * The turtle pen color
   * @deprecated will be moved to the turtle class
   */
  get penColor() {
    return this._penColor;
  }

  set penColor(color) {
    this._penColor = color;
    this._output.next("EnvironmentChange.penColor");
  }

  /**
   * Transforms the turtle position (or any other vector) from the standard cartesian space
   * to the representation on the canvas.
   * @param position Turtle position in standard coordinates
   * @returns Turtle position adjusted to the current canvas
   */
  transform(position: Vec2D): Vec2D {
    return new Vec2D(position.x + this.width / 2, this.height / 2 - position.y);
  }
}

/**
 * A type that represents possible changes to the environment state
 */
export type EnvironmentChanges =
  | "EnvironmentChange.bgColor"
  | "EnvironmentChange.penColor";
