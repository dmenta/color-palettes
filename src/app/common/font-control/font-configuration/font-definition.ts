import { MultiValuePartSetting } from "./multivalue-property";

type fontRangeDefinition = {
  type: "range";
  unit?: string | undefined;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
};
type fontBooleanDefinition = { type: "boolean"; trueValue: string; falseValue: string; defaultValue?: boolean };
type fontPartDefinition = {
  part: MultiValuePartSetting;
  configuration: fontRangeDefinition | fontBooleanDefinition;
};
type fontMultivalueDefinition = { type: "multi"; parts: fontPartDefinition[] };

export type FontPropertyDefiniion = {
  name: string;
  displayName: string;
} & (rangeProperty | booleanProperty | multivalueProperty);

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
