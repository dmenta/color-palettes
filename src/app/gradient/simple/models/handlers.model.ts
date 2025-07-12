import { Point } from "../../common/models/point.model";

export type Handlers = {
  h1: Point;
  h2: Point;
};
export type Handler = keyof Handlers;
