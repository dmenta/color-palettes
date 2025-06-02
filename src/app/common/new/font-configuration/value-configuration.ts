export type RangeConfiguration = {
  type: "range";
  min: number;
  max: number;
  defaultValue: number;
  step: number;
  stops: number[];
};

export type BooleanConfiguration = {
  type: "boolean";
  trueValue: string;
  falseValue: string;
  defaultValue: boolean;
};

export function createRangeConfiguration(
  min: number,
  max: number,
  defaultValue?: number,
  step?: number,
  stops?: number[]
): RangeConfiguration {
  defaultValue ??= min;
  step ??= 1;

  if (stops === undefined || stops.length === 0) {
    stops = [min, defaultValue, max];
  }

  return {
    type: "range",
    min,
    max,
    defaultValue,
    step,
    stops,
  };
}

export function createBooleanConfiguration(
  trueValue: string,
  falseValue: string,
  defaultValue: boolean = false
): BooleanConfiguration {
  return {
    type: "boolean",
    trueValue,
    falseValue,
    defaultValue,
  };
}
