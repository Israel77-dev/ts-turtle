// TODO: Document this file
import React, { ReactNode } from "react";
import "virtual:windi.css";

interface DataSendButtonProps {
  command: "Turtle.fd" | "Turtle.bd" | "Turtle.lt" | "Turtle.rt";
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
    className="rounded bg-green-400 w-1/1 inline-block"
  >
    {props.children}
  </button>
);
