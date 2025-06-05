import { FontDefinition } from "./font-definition";
import { MultiValueProperty, MultivaluePropertyConfiguration } from "./multivalue-property";
import { SingleValueProperty, SingleValuePropertyConfiguration } from "./singlevalue-property";

export function createFontFamily(fonts: FontDefinition[]): FontFamily[] {
  return fonts.map((font) => {
    const properties = font.properties.map((prop) => {
      switch (prop.configuration.type) {
        case "multi":
          const multiconfigurator = new MultiValueProperty(prop.name, prop.displayName);
          return multiconfigurator.createConfiguration(prop);
        case "range":
        case "boolean":
          const singleconfigurator = new SingleValueProperty(prop.name, prop.displayName);
          return singleconfigurator.createConfiguration(prop);
        default:
          throw new Error(`Unknown property type: ${prop}`);
      }
    });

    return {
      name: font.name,
      properties: properties,
    };
  });
}

export type FontFamily = {
  name: string;
  properties: (MultivaluePropertyConfiguration | SingleValuePropertyConfiguration)[];
};
