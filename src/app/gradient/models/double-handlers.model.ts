import { Handlers } from "./handlers.model";
import { Point } from "./point.model";

export type DoubleHandlers = Handlers & {
  h3: Point;
  h4: Point;
};

export type DoubleHandler = keyof DoubleHandlers;
