// User input observer

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

// Output actions

export type TurtleAction =
  | "Turtle.beginUpdate"
  | "TurtleUpdate.position"
  | "TurtleUpdate.direction"
  | "TurtleUpdate.pen";

export type EnvironmentChanges =
  | "EnvironmentChange.bgColor"
  | "EnvironmentChange.penColor";
