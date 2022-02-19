import { describe, it } from "@jest/globals";
import { Subject } from "rxjs";
import { TurtleUpdate } from "../../src/core/API/OutputAPI";
import Turtle, { TurtleState } from "../../src/core/Turtle";
import { Vec2D } from "../../src/utils/math";

let output: Subject<TurtleUpdate>;
let turtle: Turtle;

describe("Object instantiation", () => {
  it("Create a Turtle instance", () => {
    output = new Subject<TurtleUpdate>();
    turtle = new Turtle(output);
    expect(turtle).toBeDefined();
  });
});

describe("State updates", () => {
  it("Initial state", () => {
    const initialState: TurtleState = {
      position: new Vec2D(0, 0),
      direction: 0,
      isPenDown: true,
      isVisible: true,
      penColor: "white",
    };

    expect(turtle.state).toEqual(initialState);
  });
  describe("Position updates", () => {
    it("Move to specific position", () => {
      turtle.moveTo(new Vec2D(10, 10));
      expect([turtle.state.position.x, turtle.state.position.y]).toEqual([
        10, 10,
      ]);
    });

    it("Move forward", () => {
      turtle = new Turtle(output);
      turtle.forward(100);

      expect([turtle.state.position.x, turtle.state.position.y]).toEqual([
        100, 0,
      ]);
    });

    it("Move backwards", () => {
      turtle = new Turtle(output);
      turtle.backwards(100);

      expect([turtle.state.position.x, turtle.state.position.y]).toEqual([
        -100, 0,
      ]);
    });
  });

  describe("Direction (angle) updates", () => {
    it("Should rotate counter-clockwise", () => {
      turtle = new Turtle(output);
      turtle.rotateLeft(90);

      expect(turtle.state.direction).toBe(90);
    });

    it("Should rotate clockwise", () => {
      turtle = new Turtle(output);
      turtle.rotateRight(90);

      expect(turtle.state.direction).toBe(-90 % 360);
    });

    it("Should accept angles in radians", () => {
      turtle = new Turtle(output);

      turtle.rotateLeft(Math.PI / 4, "Radians");
      expect(turtle.state.direction).toEqual(45);

      turtle.rotateRight(Math.PI / 2, "Radians");
      expect(turtle.state.direction).toEqual(-45);
    });
  });

  describe("Other simple updates", () => {
    it("Can be visible", () => {
      turtle.makeVisible();
      expect(turtle.state.isVisible).toBe(true);
    });

    it("Can be invisible", () => {
      turtle.makeInvisible();
      expect(turtle.state.isVisible).toBe(false);
    });

    it("Can lift pen", () => {
      turtle.penUp();
      expect(turtle.state.isPenDown).toBe(false);
    });

    it("Can put pen down", () => {
      turtle.penDown();
      expect(turtle.state.isPenDown).toBe(true);
    });
  });

  describe("Complex (multiple) updates", () => {
    it("Sequence of movements and rotations", () => {
      turtle = new Turtle(output);

      turtle.moveTo({ x: 100, y: 50 });
      turtle.forward(350); // x = 450
      turtle.rotateLeft(90);
      turtle.forward(400); // y = 450
      expect([turtle.state.position.x, turtle.state.position.y]).toEqual([
        450, 450,
      ]);

      turtle.rotateLeft(135);
      turtle.forward(Math.sqrt(2) * 450);
      expect(turtle.state.position.x).toBeCloseTo(0);
      expect(turtle.state.position.y).toBeCloseTo(0);
      expect(turtle.state.direction).toBe(225);
    });

    it("Multiple state changes", () => {
      turtle = new Turtle(output);
      const finalState: TurtleState = {
        position: new Vec2D(125, -30),
        direction: 90,
        isVisible: false,
        isPenDown: true,
        penColor: "white",
      };

      turtle.forward(120); // x = 120
      turtle.makeInvisible();
      turtle.forward(5); // x = 125
      turtle.rotateRight(90); // dir = -90
      turtle.forward(30); // y = -30
      turtle.rotateLeft(180); // dir = 90
      turtle.penUp();
      turtle.penDown();
      expect(turtle.state).toEqual(finalState);
    });
  });
});

describe("Standard API Integration", () => {
  describe("Receive commands from the Input API", () => {
    it("TurtleForward", () => {
      turtle = new Turtle(output);
      expect(turtle.state.position.x).toBe(0);
      turtle.handleCommand({
        target: "Turtle",
        type: "fd",
        data: 100,
      });

      expect(turtle.state.position.x).toEqual(100);
    });

    it("TurtleBackward", () => {
      turtle = new Turtle(output);
      expect(turtle.state.position.x).toBe(0);
      turtle.handleCommand({
        target: "Turtle",
        type: "bk",
        data: 150,
      });

      expect(turtle.state.position.x).toBe(-150);
    });
    it("TurtleLeft", () => {
      turtle = new Turtle(output);

      turtle.handleCommand({
        target: "Turtle",
        type: "lt",
        data: 90,
      });

      expect(turtle.state.direction).toBe(90);
    });

    it("TurtleRight", () => {
      turtle = new Turtle(output);

      turtle.handleCommand({
        target: "Turtle",
        type: "rt",
        data: 90,
      });

      expect(turtle.state.direction).toBe(-90);
    });
  });

  describe("Send signals to the output API", () => {
    it("Update when moving forward", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.forward(10); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "position",
        data: { x: 10, y: 0 },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });

    it("Update when moving backwards", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.backwards(10); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "position",
        data: { x: -10, y: 0 },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });

    it("Update when turning counterclockwise", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.rotateLeft(45); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "direction",
        data: { direction: 45 },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });

    it("Update when turning clockwise", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.rotateRight(45); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "direction",
        data: { direction: -45 },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });

    it("Update visibility", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.makeInvisible(); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "visibility",
        data: { isVisible: false },
      }); // Signal update

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.makeVisible(); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "visibility",
        data: { isVisible: true },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });

    it("Update pen", () => {
      // Reset turtle and output
      output = new Subject<TurtleUpdate>();
      turtle = new Turtle(output);

      // Push all updates to an array
      const received: TurtleUpdate[] = [];
      output.subscribe((update) => received.push(update));

      // Array of expected updates
      const expectedOutput: TurtleUpdate[] = [];

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.penUp(); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "pen",
        data: { color: turtle.state.penColor, isPenDown: false },
      }); // Signal update

      // Signal beginning of update first
      expectedOutput.push({
        from: "Turtle",
        type: "beginUpdate",
        data: turtle.state,
      });
      turtle.penDown(); // Do the update
      expectedOutput.push({
        from: "Turtle",
        type: "pen",
        data: { color: turtle.state.penColor, isPenDown: true },
      }); // Signal update

      expect(received.length).toBe(expectedOutput.length);
      expect(received).toEqual(expectedOutput);
    });
  });
});
