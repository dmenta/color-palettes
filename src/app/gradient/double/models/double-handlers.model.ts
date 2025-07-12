import { Handlers } from "../../simple/models/handlers.model";
import { Point } from "../../common/models/point.model";

export type DoubleHandlers = Handlers & {
  h3?: Point;
  h4?: Point;
};

export type DoubleHandler = keyof DoubleHandlers;
