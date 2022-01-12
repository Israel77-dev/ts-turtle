import React, { PropsWithChildren } from "react";

export const DataContainer = (
  props: PropsWithChildren<Record<string, unknown>>
) => <div className="flex flex-row justify-between"> {props.children}</div>;
