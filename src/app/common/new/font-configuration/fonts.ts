import { roboto } from "../fonts/roboto";
import { robotoFlex } from "../fonts/roboto-flex";
import { FontDefinition } from "./font-definition";
import {
  MultiValuePartConfiguration,
  MultiValueProperty,
  MultivaluePropertyConfiguration,
} from "./multivalue-property";
import {
  createBooleanPropertyConfiguration,
  createRangePropertyConfiguration,
  createSingleFontProperty,
  SingleValueProperty,
} from "./singlevalue-property";

const fonts: FontDefinition[] = [robotoFlex, roboto];

export function createFontConfig(): FontFamily[] {
  return fonts.map((font) => {
    const properties = font.properties.map((prop) => {
      switch (prop.configuration.type) {
        case "range":
          const config = createRangePropertyConfiguration(
            { name: prop.name, displayName: prop.displayName, unit: prop.configuration.unit },
            prop.configuration.min,
            prop.configuration.max,
            prop.configuration.defaultValue
          );
          return createSingleFontProperty(config);

        case "boolean":
          const setting = { name: prop.name, displayName: prop.displayName };
          return createSingleFontProperty(
            createBooleanPropertyConfiguration(
              setting,
              prop.configuration.trueValue,
              prop.configuration.falseValue,
              prop.configuration.defaultValue
            )
          );
        case "multi":
          const configurator = new MultiValueProperty(prop.name, prop.displayName);
          prop.configuration.parts.forEach((part) => {
            if (part.configuration.type === "range") {
              configurator.addRangeMultiValuePartConfiguration(
                part.part,
                part.configuration.min,
                part.configuration.max,
                part.configuration.defaultValue,
                part.configuration.step
              );
            } else if (part.configuration.type === "boolean") {
              configurator.createBooleanMultiValuePartConfiguration(
                part.part,
                part.configuration.trueValue,
                part.configuration.falseValue,
                part.configuration.defaultValue
              );
            } else {
              throw new Error(`Unknown part type: ${part}`);
            }
          });

          return configurator.createConfiguration();

        default:
          throw new Error(`Unknown property type: ${prop}`);
      }
    });

    return {
      name: font.name,
      properties: properties,
    } as FontFamily;
  });
}

export type FontFamily = {
  name: string;
  properties: (MultivaluePropertyConfiguration | SingleValueProperty)[];
};
