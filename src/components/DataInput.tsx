import React from "react";
import "virtual:windi.css";

interface DataInputProps {
  target: string;
}

/**
 * Numerical input for interaction between the user and the app
 * @param props
 * @returns
 */
export const DataInput = (props: DataInputProps) => (
  <input
    type="number"
    id={`${props.target}-value`}
    className="m-1 border-dark-200 border-1 rounded w-auto w-1/1 flex-grow"
    data-payload-target={props.target}
  />
);
