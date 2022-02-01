/**
 * Interfaces that represent the messages passed from the input layer to the data layer
 * @module
 */

export type InputCommand = TurtleCommand;

interface BaseCommand {
  target: "Turtle" | "Environment";
  type: string;
  data?: unknown;
}

// ========== Turtle commands ==========

export const possibleTurtleCommands = [
  "fd",
  "bk",
  "lt",
  "rt",
  "pu",
  "pd",
] as const;
export type TurtleCommand =
  | TurtleForward
  | TurtleBackward
  | TurtleLeft
  | TurtleRight
  | TurtlePenUp
  | TurtlePenDown;

interface BaseTurtleCommand extends BaseCommand {
  target: "Turtle";
  type: typeof possibleTurtleCommands[number];
  data?: unknown;
}

export interface TurtleForward extends BaseTurtleCommand {
  type: "fd";
  data: number;
}

export interface TurtleBackward extends BaseTurtleCommand {
  type: "bk";
  data: number;
}

export interface TurtleLeft extends BaseTurtleCommand {
  type: "lt";
  data: number;
}

export interface TurtleRight extends BaseTurtleCommand {
  type: "rt";
  data: number;
}

export interface TurtlePenUp extends BaseTurtleCommand {
  type: "pu";
}

export interface TurtlePenDown extends BaseTurtleCommand {
  type: "pd";
}
