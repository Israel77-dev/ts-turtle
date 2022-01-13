// TODO: Document this file
import React from "react";
import "virtual:windi.css";

interface DataInputProps {
  target: string;
}

export const DataInput = (props: DataInputProps) => (
  <input
    type="number"
    id={`${props.target}-value`}
    className="m-1 border-dark-200 border-1 rounded w-auto w-1/1 flex-grow"
    data-payload-target={props.target}
  />
);
