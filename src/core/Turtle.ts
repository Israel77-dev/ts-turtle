import { Subject } from "rxjs";
import { Point2D, toDegrees, toRadians, Vec2D } from "../utils/math";
import { InputCommand } from "./API/InputAPI";
import {
  TurtleUpdate,
  TurtleUpdateDirection,
  TurtleUpdatePosition,
} from "./API/OutputAPI";

/**
 * An object that represents the current state of the turtle.
 */
export interface TurtleState extends Record<string, unknown> {
  /**
   * Current turtle position
   */
  position: Point2D;
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
  private _output: Subject<TurtleUpdate>;

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
    outputEvents: Subject<TurtleUpdate>,
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
  moveTo(newPosition: Point2D) {
    this._position = Vec2D.fromPoint(newPosition);

    const outputData: TurtleUpdatePosition = {
      from: "Turtle",
      type: "position",
      data: {
        x: this._position.x,
        y: this._position.y,
      },
    };
    this._output.next(outputData);
  }

  /**
   * Moves the turtle forward in the current direction by {@link length} units.
   * @param length The distance to move by.
   */
  forward(length: number) {
    if (isNaN(length)) {
      return;
    }

    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });
    const unit = new Vec2D(1, 0).rotate(this._angle);
    const offset = unit.multiply(length);
    this.moveTo(this._position.add(offset));
  }

  /**
   * Moves the turtle in the opposite direction its currently facing by {@link length} units.
   * @param length
   */
  backwards(length: number) {
    this.forward(-length);
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

    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });

    angleMode = angleMode || "Degrees";
    if (angleMode === "Degrees") {
      this._direction += angle % 360;
    } else {
      this._direction += toDegrees(angle) % 360;
    }

    const outputData: TurtleUpdateDirection = {
      from: "Turtle",
      type: "direction",
      data: {
        direction: this.state.direction,
      },
    };
    this._output.next(outputData);
  }

  /**
   * Rotates the turtle clockwise by the specified angle.
   * @param angle The angle to rotate by.
   * @param angleMode The units of the {@link angle}
   */
  rotateRight(angle: number, angleMode?: "Degrees" | "Radians") {
    this.rotateLeft(-angle, angleMode);
  }

  /**
   * Pull the pen up - no drawing when the turtle moves.
   */
  penUp() {
    // Begin update
    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });

    this._isPenDown = false;

    // Output update
    this._output.next({
      from: "Turtle",
      type: "pen",
      data: {
        color: this._penColor,
        isPenDown: this._isPenDown,
      },
    });
  }

  /**
   * Pulls the pen down - traces a path as the turtle moves.
   */
  penDown() {
    // Begin update
    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });

    // Actual algorithm
    this._isPenDown = true;

    // Output update
    this._output.next({
      from: "Turtle",
      type: "pen",
      data: {
        color: this._penColor,
        isPenDown: this._isPenDown,
      },
    });
  }

  /**
   * Makes the turtle visible on the canvas.
   */
  makeVisible() {
    // Begin update
    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });

    // Actual algorithm
    this._isVisible = true;

    // Output update
    this._output.next({
      from: "Turtle",
      type: "visibility",
      data: {
        isVisible: this._isVisible,
      },
    });
  }

  /**
   * Makes the turtle invisible
   */
  makeInvisible() {
    // Begin update
    this._output.next({
      from: "Turtle",
      type: "beginUpdate",
      data: this.state,
    });

    // Actual algorithm
    this._isVisible = false;

    // Output update
    this._output.next({
      from: "Turtle",
      type: "visibility",
      data: {
        isVisible: this._isVisible,
      },
    });
  }

  /**
   * Updates the turtle state based on given command and data
   * @param command A command to change the current turtle state
   */
  public handleCommand(command: InputCommand) {
    switch (command.type) {
      case "fd":
        this.forward(command.data || 0);
        return;
      case "bk":
        this.backwards(command.data || 0);
        return;
      case "lt":
        this.rotateLeft(command.data || 0);
        return;
      case "rt":
        this.rotateRight(command.data || 0);
        return;
      default:
        throw new Error(`Turtle: Unable to handle command ${command.type}`);
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
