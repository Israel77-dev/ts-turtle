import { Subject } from "rxjs";
import { Vec2D } from "../utils/math";
import { EnvironmentChanges } from "./Streams";

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

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set backgroundColor(color) {
    this._backgroundColor = color;
    this._output.next("EnvironmentChange.bgColor");
  }

  get penColor() {
    return this._penColor;
  }

  set penColor(color) {
    this._penColor = color;
    this._output.next("EnvironmentChange.penColor");
  }

  transform(position: Vec2D): Vec2D {
    return new Vec2D(position.x + this.width / 2, this.height / 2 - position.y);
  }
}
