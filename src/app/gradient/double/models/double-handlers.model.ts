import { Handlers } from "../../models/handlers.model";
import { Point } from "../../models/point.model";

export type DoubleHandlers = Handlers & {
  h3?: Point;
  h4?: Point;
};

export type DoubleHandler = keyof DoubleHandlers;
