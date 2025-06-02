import {
  BooleanConfiguration,
  createBooleanConfiguration,
  createRangeConfiguration,
  RangeConfiguration,
} from "./value-configuration";

export type MultiValuePartSetting = {
  identifier: string;
  displayName: string;
};

export type MultiValuePartConfiguration = MultiValuePartSetting & (RangeConfiguration | BooleanConfiguration);

export type MultiValuePartValueConfiguration = RangeConfiguration | BooleanConfiguration;

export type MultiValuePartSettingValues = {
  [key: string]: number | boolean;
};

function createMultiValuePartConfiguration(
  multiValuePart: MultiValuePartSetting,
  configuration: MultiValuePartValueConfiguration
): MultiValuePartConfiguration {
  return {
    ...multiValuePart,
    ...configuration,
  };
}

export function createRangeMultiValuePartConfiguration(
  multiValuePart: MultiValuePartSetting,
  min: number,
  max: number,
  defaultValue?: number,
  step?: number,
  stops?: number[]
) {
  return createMultiValuePartConfiguration(
    multiValuePart,
    createRangeConfiguration(min, max, defaultValue, step, stops)
  );
}

export function createBooleanMultiValuePartConfiguration(
  multiValuePart: MultiValuePartSetting,
  trueValue: string,
  falseValue: string,
  defaultValue?: boolean
) {
  return createMultiValuePartConfiguration(
    multiValuePart,
    createBooleanConfiguration(trueValue, falseValue, defaultValue)
  );
}

function createMultivaluePropertyValueFn(name: string, multiValueParts: MultiValuePartConfiguration[]) {
  const partValueFn = createMultivaluePartValueFn;

  return (values: MultiValuePartSettingValues): string | null => {
    if (values === undefined) {
      return null;
    }

    const multiValuePartValues = multiValueParts
      .map((multiValuePart) => partValueFn(multiValuePart)(values))
      .filter((v) => v !== null);

    if (multiValuePartValues.length === 0) {
      return null;
    }

    return `${name}: ${multiValuePartValues.join(", ")}`;
  };
}

function createMultivaluePartValueFn(partValueConfig: MultiValuePartConfiguration): MultiValuePartSettingValueFn {
  return (values) => {
    if (values === undefined || values[partValueConfig.identifier] === undefined) {
      return null;
    }

    const value = values[partValueConfig.identifier];

    if (partValueConfig.type === "boolean") {
      return `${partValueConfig.identifier} ${value ? partValueConfig.trueValue : partValueConfig.falseValue}`;
    }

    if (partValueConfig.type === "range") {
      return `${partValueConfig.identifier} ${value}`;
    }
    throw new Error(`Unknown variation type: ${partValueConfig}`);
  };
}

type MultiValuePartSettingValueFn = (variationValue: MultiValuePartSettingValues) => string | null;

export const knownVariations: { [key: string]: MultiValuePartSetting } = {
  width: { identifier: "'wdth'", displayName: "Width" },
  slant: { identifier: "'slnt'", displayName: "Slant" },
  grade: { identifier: "'GRAD'", displayName: "Grade" },
  lowercase: { identifier: "'YTLC'", displayName: "Lowercase" },
  uppercase: { identifier: "'YTUC'", displayName: "Uppercase" },
  ascending: { identifier: "'YTAS'", displayName: "Ascending" },
  descending: { identifier: "'YTDE'", displayName: "Descending" },
  thinStroke: { identifier: "'YOPQ'", displayName: "Thin Stroke" },
  thickStroke: { identifier: "'XOPQ'", displayName: "Thick Stroke" },
  counterWidth: { identifier: "'XTRA'", displayName: "Counter Width" },
  figureHeight: { identifier: "'YTFI'", displayName: "Figure Height" },
  softness: { identifier: "'SOFT'", displayName: "Softness" },
  wonky: { identifier: "'WONK'", displayName: "Wonky" },
};

export function createFontVariationSettingsConfiguration(multiValueParts: MultiValuePartConfiguration[]) {
  const def = {
    type: "multi",
    displayName: "Variations",
    name: "font-variation-settings",
  };

  return {
    ...def,
    multiValueParts,
    propertyValue: createMultivaluePropertyValueFn(def.name, multiValueParts),
  };
}

export type MultivaluePropertyConfiguration = ReturnType<typeof createFontVariationSettingsConfiguration>;
