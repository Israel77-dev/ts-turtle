# TS-Turtle

An implementation of turtle graphics in TypeScript, inspired by the [Logo programming language](<https://en.wikipedia.org/wiki/Logo_(programming_language)>), which was designed by Seymour Papert, Cynthia Solomon and Wally Feurzeig.

This implementation aims to be simple and modular, allowing you to use each of its parts separately or as a standalone web app.

## Project structure

The project is divided into separate modules or layers:

![Diagram showing the flow of data through the layers](/assets/data-flow.png "Data flow")

- Input layer - Responsible for sending signals from an external source (e.g. user input) to change the turtle and environment state. (The default implementation uses an UI made in React).
- Data layer - Responsible for storing and computing information about the turtle and environment. (Default implementation uses TypeScript objects and functions)

- Presentation layer - Responsible for showing the current state of the turtle, environment and making drawings. (Default implementation uses HTML5 Canvas Element)

The layers communicate with each other through a message passing mechanism, which by default uses RxJS Subjects and Observers to broadcast and handle information about events.
