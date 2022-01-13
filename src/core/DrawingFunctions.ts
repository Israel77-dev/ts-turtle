import { Vec2D } from "../utils/math";
import Environment from "./Environment";
import Turtle, { TurtleAction } from "./Turtle";

export const drawTurtleUpdate = (
  drawingContext: CanvasRenderingContext2D,
  turtleContext: CanvasRenderingContext2D,
  env: Environment,
  turtle: Turtle,
  update: TurtleAction
) => {
  const transformedPosition = () => env.transform(turtle.state.position);

  const drawTurtle = () => {
    const position = turtle.state.position;
    const distance = 10;

    // Vertices positions relative to current turtle position
    const firstVertex = new Vec2D(distance, 0);
    const secondVertex = firstVertex.rotate(120, "Degrees");
    const thirdVertex = firstVertex.rotate(-120, "Degrees");

    const vertices = [
      position.add(firstVertex),
      position.add(secondVertex),
      position.add(thirdVertex),
    ] as const;

    // Clears everything currently drawn
    turtleContext.clearRect(
      0,
      0,
      turtleContext.canvas.width,
      turtleContext.canvas.height
    );
    // Set the color of the turtle to the pen color
    turtleContext.fillStyle = env.penColor;

    // Draw the triangle shape
    turtleContext.moveTo(...vertices[0].cartesianComponents);
    turtleContext.lineTo(...vertices[1].cartesianComponents);
    turtleContext.lineTo(...vertices[2].cartesianComponents);

    // Fill the triangle
    turtleContext.fill();
  };

  switch (update) {
    case "Turtle.beginUpdate":
      drawingContext.beginPath();
      drawingContext.strokeStyle = env.penColor;
      drawingContext.moveTo(...transformedPosition().cartesianComponents);
      break;

    case "TurtleUpdate.position":
      if (turtle.state.isPenDown) {
        drawingContext.lineTo(...transformedPosition().cartesianComponents);
      } else {
        drawingContext.moveTo(...transformedPosition().cartesianComponents);
      }

      drawingContext.stroke();
      drawingContext.closePath();

      if (turtle.state.isVisible) {
        drawTurtle();
      }
      break;
  }
};
