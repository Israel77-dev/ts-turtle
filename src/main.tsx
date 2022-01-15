export * as core from "./core";
export * as utils from "./utils";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/View";

console.log("Script loaded");

ReactDOM.render(<App />, document.getElementById("root"));
