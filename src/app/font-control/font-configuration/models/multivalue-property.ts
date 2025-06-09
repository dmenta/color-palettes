import { FontPropertyDefiniion } from "./font-definition";
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
  elemGrid: { identifier: "'ELGR'", displayName: "Elemente Grid" },
  elemShape: { identifier: "'ELSH'", displayName: "Elemente Shape" },
  opticalSize: { identifier: "'opsz'", displayName: "Optical Size" },
  fill: { identifier: "'FILL'", displayName: "Fill" },
  casual: { identifier: "'CASL'", displayName: "Casual" },
  cursive: { identifier: "'CRSV'", displayName: "Cursive" },
  monospace: { identifier: "'MONO'", displayName: "Monospace" },
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

  createConfiguration(property: FontPropertyDefiniion) {
    if (property.configuration.type !== "multi") {
      throw new Error(`Expected property type 'multi', but got '${property.configuration.type}'`);
    }

    property.configuration.parts.forEach((part) => {
      if (part.configuration.type === "range") {
        this.addRangeMultiValuePartConfiguration(
          part.part,
          part.configuration.min,
          part.configuration.max,
          part.configuration.defaultValue,
          part.configuration.step
        );
      } else if (part.configuration.type === "boolean") {
        this.createBooleanMultiValuePartConfiguration(
          part.part,
          part.configuration.trueValue,
          part.configuration.falseValue,
          part.configuration.defaultValue
        );
      } else {
        throw new Error(`Unknown part type: ${part}`);
      }
    });

    return this.configuration();
  }

  private addRangeMultiValuePartConfiguration(
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

  private createBooleanMultiValuePartConfiguration(
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

  private configuration(): MultivaluePropertyConfiguration {
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

    return (values: MultiValuePartSettingValues): string | undefined => {
      if (values === undefined) {
        return undefined;
      }

      const multiValuePartValues = multiValueParts
        .map((multiValuePart) => partValueFn(multiValuePart)(values))
        .filter((v) => v !== undefined);

      if (multiValuePartValues.length === 0) {
        return undefined;
      }

      return `${name}: ${multiValuePartValues.join(", ")}`;
    };
  }

  private createMultivaluePartValueFn(partValueConfig: MultiValuePartConfiguration): MultiValuePartSettingValueFn {
    return (values) => {
      if (values === undefined || values[partValueConfig.identifier] === undefined) {
        return undefined;
      }

      const value = values[partValueConfig.identifier];

      if (partValueConfig.type === "boolean") {
        return `${partValueConfig.identifier} ${value ? partValueConfig.trueValue : partValueConfig.falseValue}`;
      }

      if (value === undefined || value === partValueConfig.defaultValue) {
        return undefined;
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

export type MultivaluePropertyConfiguration = {
  propertyType: "multi";
  name: string;
  displayName: string;
  multiValueParts: MultiValuePartConfiguration[];
  propertyValue: MultiValuePartSettingValueFn;
};

type MultiValuePartConfiguration = MultiValuePartSetting & (RangeConfiguration | BooleanConfiguration);

type MultiValuePartValueConfiguration = RangeConfiguration | BooleanConfiguration;

type MultiValuePartSettingValues = {
  [key: string]: number | boolean;
};
type MultiValuePartSettingValueFn = (variationValue: MultiValuePartSettingValues) => string | undefined;
