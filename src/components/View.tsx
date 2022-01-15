// TODO: Document this file
import React, { useEffect, useRef } from "react";
import { fromEvent, map, mergeWith, Subject } from "rxjs";
import { Vec2D } from "../utils/math";
import { drawTurtleUpdate } from "../core/DrawingFunctions";
import Environment, { EnvironmentChanges } from "../core/Environment";
import Turtle, { TurtleAction, UserInputData } from "../core/Turtle";
import { DataInput } from "./DataInput";

import "virtual:windi.css";
import { DataSendButton } from "./DataSendButton";
import { DataContainer } from "./DataContainer";

const setupCanvas = (env: Environment, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = env.backgroundColor;
  ctx.strokeStyle = env.penColor;
  ctx.fillRect(0, 0, env.width, env.height);
  ctx.moveTo(...env.transform(new Vec2D(0, 0)).cartesianComponents);
};

/**
 * The app main view
 * @returns
 */
export function App() {
  // Setup canvases
  const backgroundCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const turtleCanvasRef = useRef(null);
  // const canvasRef = useRef(null);
  const environmentUpdates = new Subject<EnvironmentChanges>();
  const turtleUpdates = new Subject<TurtleAction>();

  const turtle = new Turtle(turtleUpdates);
  const env = new Environment(environmentUpdates);

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current as HTMLCanvasElement;
    const drawingCanvas = drawingCanvasRef.current as HTMLCanvasElement;
    const turtleCanvas = turtleCanvasRef.current as HTMLCanvasElement;

    const backgroundContext = backgroundCanvas.getContext("2d");
    const drawingContext = drawingCanvas.getContext("2d");
    const turtleContext = turtleCanvas.getContext("2d");

    setupCanvas(env, backgroundContext);

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
      drawTurtleUpdate(drawingContext, turtleContext, env, turtle, update)
    );

    if (turtle.state.isVisible) {
      turtle.makeVisible();
    }
  });

  return (
    <div className="flex flex-col m-auto items-center justify-center max-w-screen-md">
      <div
        className="justify-center self-center relative"
        style={{ width: env.width, height: env.height }}
      >
        <canvas
          ref={backgroundCanvasRef}
          width={env.width}
          height={env.height}
          style={{
            position: "absolute",
            zIndex: -2,
          }}
        ></canvas>
        <canvas
          ref={drawingCanvasRef}
          width={env.width}
          height={env.height}
          style={{
            width: env.width,
            height: env.height,
            position: "absolute",
            zIndex: -1,
          }}
        ></canvas>
        <canvas
          ref={turtleCanvasRef}
          width={env.width}
          height={env.height}
          style={{
            position: "absolute",
            zIndex: 0,
          }}
        ></canvas>
      </div>

      <div className="flex flex-col self-center justify-between items-stretch w-1/1">
        <DataContainer>
          <DataInput target="Turtle.fd" />
          <DataSendButton command="Turtle.fd">Move forward!</DataSendButton>
        </DataContainer>

        <DataContainer>
          <DataInput target="Turtle.bd" />
          <DataSendButton command="Turtle.bd">Move backwards!</DataSendButton>
        </DataContainer>

        <DataContainer>
          <DataInput target="Turtle.lt" />
          <DataSendButton command="Turtle.lt">Rotate left!</DataSendButton>
        </DataContainer>

        <DataContainer>
          <DataInput target="Turtle.rt" />
          <DataSendButton command="Turtle.rt">Rotate right!</DataSendButton>
        </DataContainer>
      </div>
    </div>
  );
}
