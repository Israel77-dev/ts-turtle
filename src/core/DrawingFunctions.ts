import { Vec2D } from "../utils/math";
import Environment from "./Environment";
import Turtle from "./Turtle";
import { TurtleUpdate } from "./API/OutputAPI";

/**
 * Updates te turtle visualization based on a change on the state.
 * @param drawingContext The context where the pen strokes will be drawn
 * @param turtleContext The context where the turtle will be drawn, if visible
 * @param env The environment setup
 * @param turtle The turtle current data
 * @param update The command to update the turtle state
 */
export const drawTurtleUpdate = (
  drawingContext: CanvasRenderingContext2D,
  turtleContext: CanvasRenderingContext2D,
  env: Environment,
  turtle: Turtle,
  update: TurtleUpdate
) => {
  const _transformedPosition = () => env.transform(turtle.state.position);

  const _drawTurtle = () => {
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
    turtleContext.fillStyle = turtle.state.penColor;

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

  switch (update.type) {
    case "beginUpdate":
      drawingContext.beginPath();
      drawingContext.strokeStyle = turtle.state.penColor;
      drawingContext.moveTo(..._transformedPosition().cartesianComponents);
      break;

    case "position":
      if (turtle.state.isPenDown) {
        drawingContext.lineTo(..._transformedPosition().cartesianComponents);
      } else {
        drawingContext.moveTo(..._transformedPosition().cartesianComponents);
      }

      drawingContext.stroke();
      drawingContext.closePath();

      if (turtle.state.isVisible) {
        _drawTurtle();
      }
      break;

    case "direction":
      if (turtle.state.isVisible) {
        _drawTurtle();
      }
      break;

    case "visibility":
      if (turtle.state.isVisible) {
        _drawTurtle();
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
