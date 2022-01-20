import React, { useEffect, useRef, useState } from "react";
import { fromEvent, map, mergeWith, Subject } from "rxjs";

import { Vec2D } from "../utils/math";
import { drawTurtleUpdate } from "../core/DrawingFunctions";
import Environment from "../core/Environment";
import Turtle from "../core/Turtle";

import { InputCommand, TurtleCommand } from "../core/API/InputAPI";
import { TurtleUpdate, EnvironmentUpdate } from "../core/API/OutputAPI";

import "virtual:windi.css";
import { DataInput } from "./NumericalDataInput";
import { DataSendButton } from "./DataSendButton";
import { DataContainer } from "./DataContainer";

interface AppState {
  inputs: {
    fd: string | number;
    bk: string | number;
    lt: string | number;
    rt: string | number;
  };
}

/**
 * The app main view
 * @returns
 */
export function App() {
  const [state, setState] = useState<AppState>({
    inputs: {
      fd: "",
      bk: "",
      lt: "",
      rt: "",
    },
  });

  // Setup canvases
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const turtleCanvasRef = useRef<HTMLCanvasElement>(null);

  const inputUpdates = new Subject<InputCommand>();
  const environmentUpdates = new Subject<EnvironmentUpdate>();
  const turtleUpdates = new Subject<TurtleUpdate>();

  const turtle = new Turtle(turtleUpdates);
  const env = new Environment(environmentUpdates);

  const eraseInput = (target: keyof typeof state["inputs"]) => {
    const newState = { ...state, inputs: { ...state.inputs } };
    newState.inputs[target] = "";
    setState(newState);
  };

  useEffect(() => {
    const backgroundCanvas = backgroundCanvasRef.current as HTMLCanvasElement;
    const turtleCanvas = turtleCanvasRef.current as HTMLCanvasElement;

    const backgroundContext = backgroundCanvas.getContext("2d");
    const turtleContext = turtleCanvas.getContext("2d");

    setupCanvas(env, turtle, backgroundContext);

    inputUpdates.subscribe((userInput) => {
      console.log("User command: ", userInput);
      turtle.handleCommand(userInput);
    });

    turtleUpdates.subscribe((update) => {
      console.log("Update turtle: ", update);
      drawTurtleUpdate(backgroundContext, turtleContext, env, turtle, update);
    });

    drawTurtleUpdate(backgroundContext, turtleContext, env, turtle, {
      from: "Turtle",
      type: "visibility",
      data: {
        isVisible: turtle.state.isVisible,
      },
    });
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
                const newState = { ...state, inputs: { ...state.inputs } };
                newState.inputs[item.command] = e.target.value;
                setState(newState);
              }}
              value={state.inputs[item.command]}
            />
            <DataSendButton
              target="Turtle"
              command={item.command}
              onClick={() => {
                inputUpdates.next({
                  target: "Turtle",
                  type: item.command,
                  data: state.inputs[item.command] as number,
                });
                eraseInput(item.command);
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
