import React, { PropsWithChildren } from "react";

/**
 * A reusable component for the rows in a form
 * @param props
 * @returns
 */
export const DataContainer = (
  props: PropsWithChildren<Record<string, unknown>>
) => <div className="flex flex-row justify-between"> {props.children}</div>;
