export function createSliderOptions(range: numericRange, initialValue: number = 0, step: number, stops: number[]) {
  range = ensureMinMax(range);
  initialValue = ensureInitialValue(range, initialValue);
  step = ensureStep(range, step);
  stops = ensureStops(range, stops);

  return { ...range, defaultValue: initialValue, step, stops } as sliderOptions;
}

export type numericRange = {
  readonly min: number;
  readonly max: number;
};

function ensureStops(range: numericRange, stops: number[]) {
  return [range.min, ...stops, range.max]
    .reduce((acc, stop) => {
      if (stop >= range.min && stop <= range.max && !acc.includes(stop)) {
        acc.push(stop);
      }
      return acc;
    }, [] as number[])
    .sort();
}

function ensureStep(range: numericRange, step: number) {
  return Math.max(Math.min(rangeSize(range), Math.abs(step)), 0.1);
}

function rangeSize(range: numericRange): number {
  return Math.abs(range.max - range.min);
}

function ensureInitialValue(range: numericRange, initialValue: number) {
  return Math.max(Math.min(initialValue, range.max), range.min);
}

function ensureMinMax(range: numericRange) {
  return {
    min: Math.min(range.min, range.max),
    max: Math.max(range.min, range.max),
  } as numericRange;
}

export type sliderOptions = {
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
  readonly step: number;
  readonly stops: number[];
};
