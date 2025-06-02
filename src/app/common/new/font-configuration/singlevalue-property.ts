import {
  RangeConfiguration,
  BooleanConfiguration,
  createRangeConfiguration,
  createBooleanConfiguration,
} from "./value-configuration";

export type PropertySetting = {
  name: string;
  displayName: string;
  unit?: string;
};

export type PropertyConfiguration = PropertySetting & (RangeConfiguration | BooleanConfiguration);

export type PropertyValueConfiguration = RangeConfiguration | BooleanConfiguration;

export type PropertySettingValue = {
  [key: string]: number | boolean;
};

function createPropertyConfiguration(
  setting: PropertySetting,
  configuration: PropertyValueConfiguration
): PropertyConfiguration {
  return {
    ...setting,
    ...configuration,
  };
}
export function createRangePropertyConfiguration(
  setting: PropertySetting,
  min: number,
  max: number,
  defaultValue?: number,
  step?: number,
  stops?: number[]
) {
  return createPropertyConfiguration(setting, createRangeConfiguration(min, max, defaultValue, step, stops));
}

export function createBooleanPropertyConfiguration(
  setting: PropertySetting,
  trueValue: string,
  falseValue: string,
  defaultValue?: boolean
) {
  return createPropertyConfiguration(setting, createBooleanConfiguration(trueValue, falseValue, defaultValue));
}

export function createSingleFontProperty(configuration: PropertyConfiguration): SingleValueProperty {
  return {
    propertyType: "single",
    ...configuration,
    propertyValue: createPropertyValueFn(configuration),
  };
}

function createPropertyValueFn(config: PropertyConfiguration): (propValue: PropertySettingValue) => string | null {
  return (propValue: PropertySettingValue): string | null => {
    if (propValue === undefined) {
      return null;
    }

    const value = propValue[config.name];
    if (value === undefined) {
      return null;
    }

    if (config.type === "boolean") {
      return `${config.name}: ${value ? config.trueValue : config.falseValue}`;
    }

    if (config.type === "range") {
      return `${config.name}: ${value}${config.unit ?? ""}`;
    }

    throw new Error(`Unknown property type: ${config}`);
  };
}

export type SingleValueProperty = {
  propertyType: "single";
  propertyValue: (propValue: PropertySettingValue) => string | null;
} & PropertyConfiguration;
