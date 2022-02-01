import { Vec2D } from "../utils/math";
import Environment from "./Environment"; // TODO: Must only use the output API
import { TurtleState } from "./Turtle";
import { ViewUpdate } from "./API/OutputAPI";

/**
 * Updates the turtle visualization based on a change on the state.
 * Currently it takes the context parameter directly, in the future
 * this shall be updated to just use the API.
 * @param drawingContext The context where the pen strokes will be drawn
 * @param turtleContext The context where the turtle will be drawn, if visible
 * @param env The environment setup
  @param update The command to update the turtle state
 */
export const createViewUpdater = (
  drawingContext: CanvasRenderingContext2D,
  turtleContext: CanvasRenderingContext2D,
  env: Environment,
  initialState?: TurtleState
) => {
  let recordedState: TurtleState;

  if (initialState) {
    recordedState = initialState;
  }

  function _transformedPosition(position: Vec2D) {
    return env.transform(position);
  }

  function updateState(newState: TurtleState) {
    recordedState = newState;
  }

  function _drawIf(state: TurtleState) {
    if (state.isVisible) {
      _drawTurtle(state);
    }
  }

  function _drawTurtle(state: TurtleState) {
    const position = state.position;
    const size = 15;

    // Vertices positions relative to current turtle position
    const firstVertex = new Vec2D(size, 0).rotate(state.direction, "Degrees");
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
    turtleContext.fillStyle = state.penColor;

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
  }

  return (update: ViewUpdate) => {
    switch (update.type) {
      case "beginUpdate":
        // console.log("Update beginning");
        // console.log("Previous state", recordedState);
        updateState(update.data);

        drawingContext.beginPath();
        drawingContext.strokeStyle = update.data.penColor;
        drawingContext.moveTo(
          ..._transformedPosition(update.data.position).cartesianComponents
        );

        // console.log("New state: ", recordedState);
        break;

      case "position":
        {
          updateState({
            ...recordedState,
            position: Vec2D.fromPoint(update.data),
          });

          if (recordedState.isPenDown) {
            // If the turtle is visible draw a line from the previous position
            // to the current one
            drawingContext.lineTo(
              ..._transformedPosition(recordedState.position)
                .cartesianComponents
            );
          } else {
            // Otherwise just set the cursor to the new position
            drawingContext.moveTo(
              ..._transformedPosition(recordedState.position)
                .cartesianComponents
            );
          }

          drawingContext.stroke();
          drawingContext.closePath();

          _drawIf(recordedState);
        }
        break;

      case "direction":
        {
          updateState({
            ...recordedState,
            direction: update.data.direction,
          });

          _drawIf(recordedState);
        }
        break;

      case "visibility":
        updateState({
          ...recordedState,
          isVisible: update.data.isVisible,
        });

        if (recordedState.isVisible) {
          _drawIf(recordedState);
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
        throw new Error(`Unhandled event ${update.type}`);
    }
  };
};
