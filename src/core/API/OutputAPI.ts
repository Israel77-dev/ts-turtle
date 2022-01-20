/**
 * Interfaces that represents the messages sent from the data layer to the presentation layer
 * @module
 */

import { TurtleState } from "../Turtle";

export type ViewUpdate = TurtleUpdate | EnvironmentUpdate;

interface BaseUpdate {
  from: "Turtle" | "Environment";
  type: string;
  data?: unknown;
}

// Turtle Updates

const possibleTurtleUpdates = [
  "beginUpdate",
  "position",
  "direction",
  "pen",
  "visibility",
] as const;

export type TurtleUpdate =
  | TurtleBeginUpdate
  | TurtleUpdatePosition
  | TurtleUpdateDirection
  | TurtleUpdatePen
  | TurtleUpdateVisibility;

interface BaseTurtleUpdate extends BaseUpdate {
  from: "Turtle";
  type: typeof possibleTurtleUpdates[number];
  data?: Record<string, unknown>;
}

export interface TurtleBeginUpdate extends BaseTurtleUpdate {
  type: "beginUpdate";
  data: TurtleState;
}

export interface TurtleUpdatePosition extends BaseTurtleUpdate {
  type: "position";
  data: {
    x: number;
    y: number;
  };
}

export interface TurtleUpdateDirection extends BaseTurtleUpdate {
  type: "direction";
  data: {
    direction: number;
  };
}

export interface TurtleUpdatePen extends BaseTurtleUpdate {
  type: "pen";
  data: {
    color: string;
    isPenDown: boolean;
  };
}

export interface TurtleUpdateVisibility extends BaseTurtleUpdate {
  type: "visibility";
  data: {
    isVisible: boolean;
  };
}

// Environment updates

const possibleEnvironmentUpdates = ["backgroundColor"] as const;
export type EnvironmentUpdate = BackgroundColorUpdate;

interface BaseEnvironmentUpdate extends BaseUpdate {
  from: "Environment";
  type: typeof possibleEnvironmentUpdates[number];
  data: Record<string, unknown>;
}

export interface BackgroundColorUpdate extends BaseEnvironmentUpdate {
  type: "backgroundColor";
  data: {
    color: string;
  };
}
