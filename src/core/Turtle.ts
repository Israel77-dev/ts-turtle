import { toRadians, Vec2D } from "../utils/math";
import Environment from "./Environment";

interface TurtleState {
  x: number;
  y: number;
  direction: number;
  isPenDown: boolean;
  color: string;
  angleMode: "Degrees" | "Radians";
}

export default class Turtle {
  private _state: TurtleState;
  private _env: Environment;
  private _position: Vec2D;
  private _direction: number;
  private _isPenDown: boolean;
  private _color: string;

  public static defaultState: TurtleState = {
    x: 0,
    y: 0,
    direction: 0,
    isPenDown: true,
    color: "black",
    angleMode: "Degrees",
  };

  constructor(environment: Environment, initialState?: TurtleState) {
    this._env = environment;
    this._state = initialState || Turtle.defaultState;

    this._env.context.fillStyle;
  }

  moveTo(x: number, y: number) {
    // Draw a line if the pen is down
    if (this._state.isPenDown) {
      this._env.context.strokeStyle = this._state.color;
      this._env.context.beginPath();
      this._env.context.moveTo(this._state.x, this._state.y);
      this._env.context.lineTo(x, y);
      this._env.context.stroke();
    }

    // Move the turtle to the new location
    [this._state.x, this._state.y] = [x, y];
  }

  forward(length: number) {
    let _dx: number, _dy: number;
    if (this._state.angleMode === "Radians") {
      [_dx, _dy] = [
        length * Math.cos(this._state.direction),
        -length * Math.sin(this._state.direction),
      ];
    } else {
      [_dx, _dy] = [
        length * Math.cos(toRadians(this._state.direction)),
        -length * Math.sin(toRadians(this._state.direction)),
      ];
    }

    this.moveTo(this._state.x + _dx, this._state.y + _dy);
  }

  backwards(length: number) {
    this.forward(-length);
  }

  rotateLeft(angle: number) {
    if (this._state.angleMode === "Degrees") {
      this._state.direction += angle % 360;
    } else {
      this._state.direction += angle % (2 * Math.PI);
    }
  }

  rotateRight(angle: number) {
    this.rotateLeft(-angle);
  }

  setColor(color: string) {
    this._state.color = color;
  }

  penUp() {
    this._state.isPenDown = false;
  }

  penDown() {
    this._state.isPenDown = true;
  }

  public get state() {
    return {
      position: new Vec2D(this._state.x, this._state.y),
      direction: this._state.direction,
      color: this._state.color,
      isPenDown: this._state.isPenDown,
    };
  }
}
