import { MultiValuePartSetting } from "./multivalue-property";

type fontRangeDefinition = {
  type: "range";
  unit?: string | undefined;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  stops?: number[];
};
type fontBooleanDefinition = { type: "boolean"; trueValue: string; falseValue: string; defaultValue?: boolean };
type fontPartDefinition = {
  part: MultiValuePartSetting;
  configuration: fontRangeDefinition | fontBooleanDefinition;
};
type fontMultivalueDefinition = { type: "multi"; parts: fontPartDefinition[] };

export type FontPropertyDefiniion = Prettify<
  {
    name: string;
    displayName: string;
  } & (rangeProperty | booleanProperty | multivalueProperty)
>;

type rangeProperty = {
  configuration: fontRangeDefinition;
};
type booleanProperty = {
  configuration: fontBooleanDefinition;
};
type multivalueProperty = {
  configuration: fontMultivalueDefinition;
};

export type FontDefinition = {
  name: string;
  properties: FontPropertyDefiniion[];
};

export function createWeigthStandardDedinition(min: number, max: number) {
  return {
    type: "range",
    name: "font-weight",
    displayName: "Weight",
    configuration: {
      type: "range",
      min,
      max,
      defaultValue: 400,
      step: 10,
      stops: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    },
  };
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
