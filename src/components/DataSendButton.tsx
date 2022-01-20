// TODO: Document this file
import React, { EventHandler, MouseEventHandler, ReactNode } from "react";
import "virtual:windi.css";
import { possibleTurtleCommands } from "../core/API/InputAPI";

interface DataSendButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  target: "Turtle" | "Environment";
  command: typeof possibleTurtleCommands[number];
  onClick?: MouseEventHandler;
  children?: ReactNode;
}

/**
 * Button to trigger events to the app.
 * @param props
 * @returns
 */
export const DataSendButton = (props: DataSendButtonProps) => (
  <button
    id={props.command}
    onClick={props.onClick}
    className="rounded bg-green-400 w-1/1 inline-block"
  >
    {props.children}
  </button>
);
