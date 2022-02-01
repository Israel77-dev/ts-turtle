import React, { useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";

import { Vec2D } from "../utils/math";
import { createViewUpdater } from "../core/DrawingFunctions";
import Environment from "../core/Environment";
import Turtle from "../core/Turtle";

import { InputCommand } from "../core/API/InputAPI";
import {
  TurtleUpdate,
  EnvironmentUpdate,
  ViewUpdate,
} from "../core/API/OutputAPI";

import "virtual:windi.css";
import { DataInput } from "./NumericalDataInput";
import { DataSendButton } from "./DataSendButton";
import { DataContainer } from "./DataContainer";

interface InputState {
  fd: number | string;
  bk: number | string;
  lt: number | string;
  rt: number | string;
}

/**
 * The app main view
 * @returns
 */
export function App() {
  const turtleUpdates = useRef(new Subject<TurtleUpdate>());
  const environmentUpdates = useRef(new Subject<EnvironmentUpdate>());
  const inputUpdates = useRef(new Subject<InputCommand>());
  const updateView = useRef<(update: ViewUpdate) => void>(null);

  // Split into multiple state variables instead of using a single
  // Nested state object as before
  const [inputs, setInputs] = useState<InputState>({
    fd: "",
    bk: "",
    lt: "",
    rt: "",
  });

  const turtle = new Turtle(turtleUpdates.current);
  const env = new Environment(environmentUpdates.current);
  // Setup canvases
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const turtleCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current as HTMLCanvasElement;
    const turtleCanvas = turtleCanvasRef.current as HTMLCanvasElement;

    const backgroundContext = backgroundCanvas.getContext("2d");
    const turtleContext = turtleCanvas.getContext("2d");

    updateView.current = createViewUpdater(
      backgroundContext,
      turtleContext,
      env,
      turtle.state
    );

    setupCanvas(env, turtle, backgroundContext);
  });

  useEffect(() => {
    inputUpdates.current.subscribe((userInput) => {
      // console.log("State on input:", turtle.state);
      turtle.handleCommand(userInput);
    });

    turtleUpdates.current.subscribe((update) => {
      // console.log("State on view update: ", turtle.state);
      updateView.current(update);
    });

    // Allow interactive control of the turtle via terminal
    // window.turtle =
  }, []);

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
        {/* <canvas
          ref={drawingCanvasRef}
          width={env.width}
          height={env.height}
          style={{
            width: env.width,
            height: env.height,
            position: "absolute",
            zIndex: -1,
          }}
        ></canvas> */}
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
        {(
          [
            { command: "fd", message: "Move forward" },
            { command: "bk", message: "Move backwards" },
            { command: "lt", message: "Rotate left" },
            { command: "rt", message: "Rotate right" },
          ] as const
        ).map((item, index) => (
          <DataContainer key={index}>
            <DataInput
              target="Turtle"
              command={item.command}
              onChange={(e) => {
                const newInputState = { ...inputs };
                newInputState[item.command] = e.target.value;
                setInputs(newInputState);
              }}
              value={inputs[item.command]}
            />
            <DataSendButton
              target="Turtle"
              command={item.command}
              onClick={() => {
                inputUpdates.current.next({
                  target: "Turtle",
                  type: item.command,
                  data: inputs[item.command] as number,
                });
                setInputs({
                  fd: "",
                  bk: "",
                  lt: "",
                  rt: "",
                });
              }}
            >
              {" "}
              {item.message}
            </DataSendButton>
          </DataContainer>
        ))}
      </div>
    </div>
  );
}

const setupCanvas = (
  env: Environment,
  turtle: Turtle,
  ctx: CanvasRenderingContext2D
) => {
  // ctx.fillStyle = env.backgroundColor;
  // ctx.fillRect(0, 0, env.width, env.height);
  ctx.canvas.style.background = "black";
  ctx.strokeStyle = turtle.state.penColor;
  ctx.moveTo(...env.transform(new Vec2D(0, 0)).cartesianComponents);
};
