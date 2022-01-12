import Environment from "./Environment";
import { TurtleAction } from "./Streams";
import Turtle from "./Turtle";

export const drawTurtleUpdate = (
  ctx: CanvasRenderingContext2D,
  env: Environment,
  turtle: Turtle,
  update: TurtleAction
) => {
  const transformedPosition = () => env.transform(turtle.state.position);
  switch (update) {
    case "Turtle.beginUpdate":
      ctx.beginPath();
      ctx.strokeStyle = env.penColor;
      ctx.moveTo(...transformedPosition().cartesianComponents);
      break;

    case "TurtleUpdate.position":
      if (turtle.state.isPenDown) {
        ctx.lineTo(...transformedPosition().cartesianComponents);
      } else {
        ctx.moveTo(...transformedPosition().cartesianComponents);
      }

      ctx.stroke();
      ctx.closePath();
      break;
  }
};
