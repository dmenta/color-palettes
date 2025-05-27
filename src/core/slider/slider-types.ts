export function createSliderOptions(range: numericRange, initialValue: number = 0, step: number, stops: number[]) {
  range = ensureMinMax(range);
  initialValue = ensureInitialValue(range, initialValue);
  step = ensureStep(range, step);
  stops = ensureStops(range, stops);

  return { range, initialValue, step, stops } as sliderOptions;
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
  range: numericRange;
  readonly initialValue: number;
  readonly step: number;
  readonly stops: number[];
};

//#region Slider CSS Classes
const sliderClasses = [
  {
    selector: [],
    groups: [
      {
        prefixes: [],
        classes: [
          "flex",
          "h-[.75rem]",
          "w-full",
          "cursor-pointer",
          "appearance-none",
          "flex-row",
          "items-center",
          "focus:outline-none",
        ],
      },
    ],
  },
  {
    selector: ["[&::-webkit-slider-thumb]"],
    groups: [
      {
        prefixes: [],
        classes: ["mt-[-0.25rem]", "h-[.75rem]", "w-[.75rem]", "appearance-none", "rounded-full", "bg-orange-600/80"],
      },
      { prefixes: ["focus"], classes: ["outline-offset-1", "outline-2", "outline-orange-400/80"] },
      { prefixes: ["dark"], classes: ["bg-blue-400/80"] },
      { prefixes: ["dark", "focus"], classes: ["outline-blue-600/80"] },
    ],
  },
  {
    selector: ["[&::-webkit-slider-runnable-track]"],
    groups: [
      {
        prefixes: [],
        classes: ["h-[.25rem]", "rounded-full", "bg-black/20"],
      },
      { prefixes: ["dark"], classes: ["bg-white/30"] },
    ],
  },
];

const classNames = sliderClasses
  .map((sel) =>
    sel.groups.map((group) => group.classes.map((cls) => [...group.prefixes, ...sel.selector, cls].join(":")))
  )
  .flat(3);

//#endregion
