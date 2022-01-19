import { Subject } from "rxjs";
import { toDegrees, toRadians, Vec2D } from "../utils/math";

/**
 * An object that represents the current state of the turtle.
 */
export interface TurtleState {
  /**
   * Current turtle position
   */
  position: Vec2D;
  /**
   * Current turtle direction, represented as the angle, in degrees between the direction
   * the turtle is facing and the positive x-axis.
   */
  direction: number;
  /** True if the pen is meant to be down (draw path as the turtle moves) */
  isPenDown: boolean;
  /** True if the turtle is meant to be visible. */
  isVisible: boolean;
  /** The current turtle pen color */
  penColor: string;
}

/**
 * A turtle that can move and make drawings in a 2d space.
 */
export default class Turtle {
  private _position: Vec2D;
  private _direction: number;
  private _isPenDown: boolean;
  private _isVisible: boolean;
  private _penColor: string;
  private _output: Subject<TurtleAction>;

  /**
   * Creates a new turtle given a stream to broadcast turtle updates (as a rxjs Subject) and
   * the initial state parameters.
   * @param outputEvents The stream to broadcast turtle updates.
   * @param position Initial turtle position
   * @param direction Initial turtle direction
   * @param isPenDown Initial pen state
   * @param isVisible Initial turtle visibility
   */
  constructor(
    outputEvents: Subject<TurtleAction>,
    position?: Vec2D,
    direction?: number,
    isPenDown?: boolean,
    isVisible?: boolean,
    penColor?: string
  ) {
    this._output = outputEvents;
    this._position = position || new Vec2D(0, 0);
    this._direction = direction || 0;
    this._isPenDown = isPenDown || true;
    this._isVisible = isVisible || true;
    this._penColor = penColor || "white";
  }

  /**
   * The angle equivalent to the current direction, in radians
   */
  private get _angle() {
    return toRadians(this._direction);
  }

  /**
   * Moves the turtle from its current location to a new position.
   * @param newPosition The new position of the turtle.
   */
  moveTo(newPosition: Vec2D) {
    this._position = newPosition;
  }

  /**
   * Moves the turtle forward in the current direction by {@link length} units.
   * @param length The distance to move by.
   */
  forward(length: number) {
    if (isNaN(length)) {
      return;
    }

    this._output.next("Turtle.beginUpdate");
    const unit = new Vec2D(0, 1).rotate(this._angle);
    const offset = unit.multiply(length);

    this.moveTo(this._position.add(offset));
    this._output.next("TurtleUpdate.position");
  }

  /**
   * Moves the turtle in the opposite direction its currently facing by {@link length} units.
   * @param length
   */
  backwards(length: number) {
    this.forward(-length);
    this._output.next("TurtleUpdate.position");
  }

  /**
   * Rotate the turtle counter-clockwise by the specified angle.
   * @param angle The angle to rotate by.
   * @param angleMode The units of the angle.
   */
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

  /**
   * Rotates the turtle clockwise by the specified angle.
   * @param angle The angle to rotate by.
   * @param angleMode The units of the {@link angle}
   */
  rotateRight(angle: number, angleMode?: "Degrees" | "Radians") {
    this.rotateLeft(-angle, angleMode);
    this._output.next("TurtleUpdate.direction");
  }

  /**
   * Pull the pen up - no drawing when the turtle moves.
   */
  penUp() {
    this._output.next("Turtle.beginUpdate");
    this._isPenDown = false;
    this._output.next("TurtleUpdate.pen");
  }

  /**
   * Pulls the pen down - traces a path as the turtle moves.
   */
  penDown() {
    this._output.next("Turtle.beginUpdate");
    this._isPenDown = true;
    this._output.next("TurtleUpdate.pen");
  }

  /**
   * Makes the turtle visible on the canvas.
   */
  makeVisible() {
    this._output.next("Turtle.beginUpdate");
    this._isVisible = true;
    this._output.next("TurtleUpdate.visibility");
  }

  /**
   * Makes the turtle invisible
   */
  makeInvisible() {
    this._output.next("Turtle.beginUpdate");
    this._isVisible = false;
    this._output.next("TurtleUpdate.visibility");
  }

  /**
   * Updates the turtle state based on given command and data
   * @param update A command to change the current turtle state
   */
  public handleUpdate(update: UserInputData) {
    switch (update.command) {
      case "Turtle.fd":
        this.forward(update.payload || 0);
        return;
      case "Turtle.bd":
        this.backwards(update.payload || 0);
        return;
      case "Turtle.lt":
        this.rotateLeft(update.payload || 0);
        return;
      case "Turtle.rt":
        this.rotateRight(update.payload || 0);
        return;
      default:
        throw new Error(`Unhandled command ${update.command}`);
    }
  }

  /**
   * The current turtle state.
   */
  public get state(): TurtleState {
    return {
      position: this._position,
      direction: this._direction,
      isPenDown: this._isPenDown,
      isVisible: this._isVisible,
      penColor: this._penColor,
    };
  }
}

/**
 * A type that represents the possible changes to the current turtle state.
 * Used to notify the rendering engine of changes.
 */
export type TurtleAction =
  | "Turtle.beginUpdate" // Signal that the turtle state will change
  | "TurtleUpdate.position"
  | "TurtleUpdate.direction"
  | "TurtleUpdate.pen"
  | "TurtleUpdate.visibility";

/**
 * Commands sent to the turtle to update its current state.
 * Used to notify the turtle of user actions.
 */
type InputCommand = typeof possibleInputCommands[number];
const possibleInputCommands = [
  "Turtle.fd",
  "Turtle.bd",
  "Turtle.lt",
  "Turtle.rt",
] as const; // Construct to make possible to iterate over the type

/**
 * Object emitted by events that makes the turtle change its current state.
 */
export type UserInputData = {
  command: InputCommand;
  payload?: number;
};
