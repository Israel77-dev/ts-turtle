import React, { useEffect, useRef } from "react";
import { fromEvent, map, mergeWith, Subject } from "rxjs";
import { Vec2D } from "../utils/math";
import { drawTurtleUpdate } from "./DrawingFunctions";
import Environment from "./Environment";
import { EnvironmentChanges, TurtleAction, UserInputData } from "./Streams";
import Turtle from "./Turtle";

const setupCanvas = (env: Environment, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = env.backgroundColor;
  ctx.strokeStyle = env.penColor;
  ctx.fillRect(0, 0, env.width, env.height);
  ctx.moveTo(...env.transform(new Vec2D(0, 0)).cartesianComponents);
};

export function App() {
  const canvasRef = useRef(null);
  const environmentUpdates = new Subject<EnvironmentChanges>();
  const turtleUpdates = new Subject<TurtleAction>();

  const turtle = new Turtle(turtleUpdates);
  const env = new Environment(environmentUpdates);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    setupCanvas(env, context);

    const userActionEvents = [
      fromEvent(document.getElementById("Turtle.fd"), "click"),
      fromEvent(document.getElementById("Turtle.bd"), "click"),
      fromEvent(document.getElementById("Turtle.rt"), "click"),
      fromEvent(document.getElementById("Turtle.lt"), "click"),
    ] as const;

    const transformActionEvent = (ev: Event) => {
      const buttonElement = ev.target as HTMLButtonElement;
      const inputElement = document.querySelector(
        `[data-payload-target="${buttonElement.id}"]`
      ) as HTMLInputElement;
      const payload = parseInt(inputElement.value);

      // Clears the input before returning
      inputElement.value = "";

      return {
        command: (ev.target as HTMLButtonElement).id,
        payload: payload,
      } as UserInputData;
    };

    userActionEvents[0]
      .pipe(mergeWith(...userActionEvents.slice(1)), map(transformActionEvent))
      .subscribe((update) => turtle.handleUpdate(update));

    // Turtle updates stream

    turtleUpdates.subscribe((update) =>
      drawTurtleUpdate(context, env, turtle, update)
    );
  });

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={400}></canvas>

      <div>
        <div>
          <input
            type="number"
            name="Forward-data"
            id="fd-data"
            data-payload-target="Turtle.fd"
          />
          <button id="Turtle.fd">Forward</button>
        </div>

        <div>
          <input
            type="number"
            name="Forward-data"
            id="fd-data"
            data-payload-target="Turtle.bd"
          />
          <button id="Turtle.bd">Backwards</button>
        </div>

        <div>
          <input
            type="number"
            name="Forward-data"
            id="fd-data"
            data-payload-target="Turtle.lt"
          />
          <button id="Turtle.lt">Left</button>
        </div>

        <div>
          <input
            type="number"
            name="Forward-data"
            id="fd-data"
            data-payload-target="Turtle.rt"
          />
          <button id="Turtle.rt">Right</button>
        </div>
      </div>
    </div>
  );
}
