export type RangeConfiguration = {
  type: "range";
  min: number;
  max: number;
  defaultValue?: number;
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
  step ??= 1;

  if (stops === undefined || stops.length === 0) {
    stops = defaultValue ? [min, defaultValue, max] : [min, max];
  }

  return {
    type: "range",
    min,
    max,
    defaultValue: defaultValue,
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
