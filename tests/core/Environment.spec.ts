import { describe, it } from "@jest/globals";
import Environment from "../../src/core/Environment";
import { EnvironmentUpdate } from "../../src/core/API/OutputAPI";
import { Subject } from "rxjs";

let env: Environment;
let output: Subject<EnvironmentUpdate>;

describe("Environment tests", () => {
  it("Create a new environment", () => {
    output = new Subject<EnvironmentUpdate>();
    env = new Environment(output);

    expect(env.backgroundColor).toBe("black");
    expect(env.width).toBe(768);
    expect(env.height).toBe(400);
  });

  it("Update color", () => {
    const received: EnvironmentUpdate[] = [];
    output.subscribe((update) => received.push(update));

    (env.backgroundColor = "Red"), expect(env.backgroundColor).toBe("Red");
    expect(received[0]).toEqual<EnvironmentUpdate>({
      from: "Environment",
      type: "backgroundColor",
      data: { color: "Red" },
    });
  });
});
