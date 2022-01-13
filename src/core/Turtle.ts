import { Subject } from "rxjs";
import { toDegrees, toRadians, Vec2D } from "../utils/math";

export interface TurtleState {
  position: Vec2D;
  direction: number;
  isPenDown: boolean;
  isVisible: boolean;
}

export default class Turtle {
  private _position: Vec2D;
  private _direction: number;
  private _isPenDown: boolean;
  private _isVisible: boolean;
  private _output: Subject<TurtleAction>;

  constructor(
    outputEvents: Subject<TurtleAction>,
    position?: Vec2D,
    direction?: number,
    isPenDown?: boolean
  ) {
    this._output = outputEvents;
    this._position = position || new Vec2D(0, 0);
    this._direction = direction || 0;
    this._isPenDown = isPenDown || true;
  }

  /**
   * The angle equivalent to the current direction, in radians
   * @returns {number}
   */
  private get _angle() {
    return toRadians(this._direction);
  }

  moveTo(newPosition: Vec2D) {
    this._position = newPosition;
  }

  forward(length: number) {
    if (isNaN(length)) {
      return;
    }

    this._output.next("Turtle.beginUpdate");
    const unit = new Vec2D(Math.cos(this._angle), Math.sin(this._angle));
    const offset = unit.multiply(length);

    this.moveTo(this._position.add(offset));
    this._output.next("TurtleUpdate.position");
  }

  backwards(length: number) {
    this.forward(-length);
    this._output.next("TurtleUpdate.position");
  }

  rotateLeft(angle: number, angleMode?: "Degrees" | "Radians") {
    if (isNaN(angle)) {
      return;
    }

    angleMode = angleMode || "Degrees";
    if (angleMode === "Degrees") {
      this._direction += angle % 360;
    } else {
      this._direction += toDegrees(angle) % 360;
    }
    this._output.next("TurtleUpdate.direction");
  }

  rotateRight(angle: number, angleMode?: "Degrees" | "Radians") {
    this.rotateLeft(-angle, angleMode);
    this._output.next("TurtleUpdate.direction");
  }

  penUp() {
    this._isPenDown = false;
    this._output.next("TurtleUpdate.pen");
  }

  penDown() {
    this._isPenDown = true;
    this._output.next("TurtleUpdate.pen");
  }

  makeVisible() {
    this._isVisible = true;
    this._output.next("TurtleUpdate.visibility");
  }

  makeInvisible() {
    this._isVisible = false;
    this._output.next("TurtleUpdate.visibility");
  }

  public handleUpdate(update: UserInputData) {
    switch (update.command) {
      case "Turtle.fd":
        this.forward(update.payload);
        return;
      case "Turtle.bd":
        this.backwards(update.payload);
        return;
      case "Turtle.lt":
        this.rotateLeft(update.payload);
        return;
      case "Turtle.rt":
        this.rotateRight(update.payload);
        return;
      default:
        throw new Error(`Unhandled command ${update.command}`);
    }
  }

  public get state(): TurtleState {
    return {
      position: this._position,
      direction: this._direction,
      isPenDown: this._isPenDown,
      isVisible: this._isVisible,
    };
  }
}

export type TurtleAction =
  | "Turtle.beginUpdate"
  | "TurtleUpdate.position"
  | "TurtleUpdate.direction"
  | "TurtleUpdate.pen"
  | "TurtleUpdate.visibility";

const possibleInputCommands = [
  "Turtle.fd",
  "Turtle.bd",
  "Turtle.lt",
  "Turtle.rt",
] as const;
type InputCommand = typeof possibleInputCommands[number];
export type UserInputData = {
  command: InputCommand;
  payload?: number;
};
