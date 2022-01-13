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
    const size = 15;

    // Vertices positions relative to current turtle position
    const firstVertex = new Vec2D(size, 0).rotate(
      turtle.state.direction,
      "Degrees"
    );
    const secondVertex = firstVertex.rotate(120, "Degrees");
    const thirdVertex = firstVertex.rotate(240, "Degrees");

    const vertices = [firstVertex, secondVertex, thirdVertex]
      .map((v) => position.add(v))
      .map((v) => env.transform(v));

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
    turtleContext.beginPath();
    turtleContext.moveTo(...vertices[0].cartesianComponents);
    turtleContext.lineTo(...vertices[1].cartesianComponents);
    turtleContext.lineTo(...vertices[2].cartesianComponents);

    turtleContext.moveTo(...vertices[1].cartesianComponents);
    turtleContext.bezierCurveTo(
      ...vertices[1].cartesianComponents,
      ...vertices[0].cartesianComponents,
      ...vertices[2].cartesianComponents
    );

    // Fill the triangle
    turtleContext.closePath();
    turtleContext.fill("evenodd");
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

    case "TurtleUpdate.direction":
      if (turtle.state.isVisible) {
        drawTurtle();
      }
      break;

    case "TurtleUpdate.visibility":
      if (turtle.state.isVisible) {
        drawTurtle();
      } else {
        turtleContext.clearRect(
          0,
          0,
          turtleContext.canvas.width,
          turtleContext.canvas.height
        );
      }
      break;

    default:
      throw new Error(`Unhandled event ${update}`);
  }
};
