import { FontPropertyDefiniion } from "./font-definition";
import {
  BooleanConfiguration,
  createBooleanConfiguration,
  createRangeConfiguration,
  RangeConfiguration,
} from "./value-configuration";

export class SingleValueProperty {
  readonly propertyType = "multi";
  readonly name: string;
  readonly displayName: string;

  constructor(name: string, displayName: string) {
    this.name = name;
    this.displayName = displayName;
  }

  private createSingleFontProperty(configuration: PropertyConfiguration): SingleValuePropertyConfiguration {
    return {
      propertyType: "single",
      ...configuration,
      propertyValue: this.createPropertyValueFn(configuration),
    };
  }
  public createConfiguration(property: FontPropertyDefiniion) {
    const def = property.configuration;

    if (def.type === "range") {
      const valueConfig = createRangeConfiguration(def.min, def.max, def.defaultValue, def.step, def.stops);
      const config = this.createPropertyConfiguration(valueConfig, def.unit);
      return this.createSingleFontProperty(config);
    }
    if (def.type === "boolean") {
      const valueConfig = createBooleanConfiguration(def.trueValue, def.falseValue, def.defaultValue);
      const config = this.createPropertyConfiguration(valueConfig);

      return this.createSingleFontProperty(config);
    }

    throw new Error(`Expected property type 'range' or 'boolean', but got '${def.type}'`);
  }
  private createPropertyConfiguration(configuration: PropertyValueConfiguration, unit?: string): PropertyConfiguration {
    return {
      name: this.name,
      displayName: this.displayName,
      unit: unit,
      ...configuration,
    };
  }
  private createPropertyValueFn(
    config: PropertyConfiguration
  ): (propValue: PropertySettingValue) => string | undefined {
    return (propValue: PropertySettingValue): string | undefined => {
      if (propValue === undefined) {
        return undefined;
      }

      const value = propValue[config.name];
      if (value === undefined) {
        return undefined;
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
}

export type SingleValuePropertyConfiguration = {
  propertyType: "single";
  propertyValue: (propValue: PropertySettingValue) => string | undefined;
} & PropertyConfiguration;

type PropertySetting = {
  name: string;
  displayName: string;
  unit?: string;
};

type PropertyConfiguration = PropertySetting & (RangeConfiguration | BooleanConfiguration);

type PropertyValueConfiguration = RangeConfiguration | BooleanConfiguration;

type PropertySettingValue = {
  [key: string]: number | boolean;
};
