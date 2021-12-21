import Turtle from "./core/Turtle";
import Environment from "./core/Environment";

const handleCommand = (
  turtle: Turtle,
  command: "fd" | "bd" | "lt" | "rt",
  value: number
) => {
  if (isNaN(value)) {
    value = 0;
  }

  switch (command) {
    case "fd":
      turtle.forward(value);
      break;

    case "bd":
      turtle.backwards(value);
      break;

    case "lt":
      turtle.rotateLeft(value);
      break;

    case "rt":
      turtle.rotateRight(value);
      break;
  }
};

const setupEvents = (root: HTMLElement, turtle: Turtle) => {
  const buttons = root.querySelectorAll("button");

  for (const button of buttons) {
    let command = button.dataset.command as "fd" | "bd" | "lt" | "rt";
    let input = root.querySelector(`#${command}`) as HTMLInputElement;

    button.addEventListener("click", (ev) => {
      const value = input.valueAsNumber;
      console.log(turtle);
      // console.log(command);
      console.log(value);
      handleCommand(turtle, command, value);
      input.value = "";
    });
  }
};

const setupTurtle = (): Turtle => {
  const env = new Environment(document.querySelector("canvas"));
  const turtle = new Turtle(env);

  // Position at center
  turtle.penUp();
  turtle.moveTo(env.width / 2, env.height / 2);
  turtle.penDown();
  turtle.setColor("white");

  return turtle;
};

(function main() {
  const t = setupTurtle();
  setupEvents(document.querySelector(".controls"), t);
})();
