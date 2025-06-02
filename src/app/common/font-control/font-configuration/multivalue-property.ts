import {
  BooleanConfiguration,
  createBooleanConfiguration,
  createRangeConfiguration,
  RangeConfiguration,
} from "./value-configuration";

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

export class MultiValueProperty {
  readonly propertyType = "multi";
  readonly name: string;
  readonly displayName: string;

  readonly multiValueParts: MultiValuePartConfiguration[] = [];
  constructor(name: string, displayName: string) {
    this.name = name;
    this.displayName = displayName;
  }
  public addRangeMultiValuePartConfiguration(
    multiValuePart: MultiValuePartSetting,
    min: number,
    max: number,
    defaultValue?: number,
    step?: number,
    stops?: number[]
  ) {
    this.multiValueParts.push(
      this.createMultiValuePartConfiguration(
        multiValuePart,
        createRangeConfiguration(min, max, defaultValue, step, stops)
      )
    );
  }

  public createBooleanMultiValuePartConfiguration(
    multiValuePart: MultiValuePartSetting,
    trueValue: string,
    falseValue: string,
    defaultValue?: boolean
  ) {
    this.multiValueParts.push(
      this.createMultiValuePartConfiguration(
        multiValuePart,
        createBooleanConfiguration(trueValue, falseValue, defaultValue)
      )
    );
  }

  public createConfiguration(): MultivaluePropertyConfiguration {
    if (this.multiValueParts.length === 0) {
      throw new Error("No multi-value parts configured");
    }

    return {
      propertyType: this.propertyType,
      name: this.name,
      displayName: this.displayName,
      multiValueParts: this.multiValueParts,
      propertyValue: this.createMultivaluePropertyValueFn(this.name, this.multiValueParts),
    };
  }
  private createMultiValuePartConfiguration(
    multiValuePart: MultiValuePartSetting,
    configuration: MultiValuePartValueConfiguration
  ): MultiValuePartConfiguration {
    return {
      ...multiValuePart,
      ...configuration,
    };
  }

  private createMultivaluePropertyValueFn(name: string, multiValueParts: MultiValuePartConfiguration[]) {
    const partValueFn = this.createMultivaluePartValueFn;

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

  createMultivaluePartValueFn(partValueConfig: MultiValuePartConfiguration): MultiValuePartSettingValueFn {
    return (values) => {
      if (values === undefined || values[partValueConfig.identifier] === undefined) {
        return null;
      }

      const value = values[partValueConfig.identifier];

      if (partValueConfig.type === "boolean") {
        return `${partValueConfig.identifier} ${value ? partValueConfig.trueValue : partValueConfig.falseValue}`;
      }

      if (value === undefined || value === partValueConfig.defaultValue) {
        return null;
      }

      if (partValueConfig.type === "range") {
        return `${partValueConfig.identifier} ${value}`;
      }
      throw new Error(`Unknown variation type: ${partValueConfig}`);
    };
  }
}
export type MultiValuePartSetting = {
  identifier: string;
  displayName: string;
};

export type MultiValuePartConfiguration = MultiValuePartSetting & (RangeConfiguration | BooleanConfiguration);

export type MultiValuePartValueConfiguration = RangeConfiguration | BooleanConfiguration;

export type MultiValuePartSettingValues = {
  [key: string]: number | boolean;
};
type MultiValuePartSettingValueFn = (variationValue: MultiValuePartSettingValues) => string | null;

export type MultivaluePropertyConfiguration = {
  propertyType: "multi";
  name: string;
  displayName: string;
  multiValueParts: MultiValuePartConfiguration[];
  propertyValue: MultiValuePartSettingValueFn;
};
