type SingleStylePropertyDefinition = {
  readonly type: "single";
};
type MultiStylePropertyDefinition = {
  readonly type: "multi";
  readonly identifier: string;
};

export type StylePropertyDefinition = {
  readonly caption: string;
  readonly name: stylePropertyName;
  readonly suffix?: string;
} & (SingleStylePropertyDefinition | MultiStylePropertyDefinition);

export type stylePropertyName =
  | "font-size"
  | "font-weight"
  | "font-variation-settings"
  | "font-style"
  | "font-stretch"
  | "font-family";

export class StyleProperty {
  readonly definition: StylePropertyDefinition;

  constructor(definition: StylePropertyDefinition) {
    this.definition = definition;
  }
  propertyValue(value: number): StylePropertyValue {
    if (this.definition.type === "single") {
      return {
        type: this.definition.type,
        name: this.definition.name,
        value: `${value}${this.definition.suffix ?? ""}`,
      };
    }
    if (this.definition.type === "multi") {
      return {
        type: this.definition.type,
        name: this.definition.name,
        identifier: this.definition.identifier,
        value: `${this.definition.identifier} ${value}`,
      };
    }
    throw new Error("Invalid property type");
  }
}

type SingleStylePropertyValue = {
  readonly type: "single";
};
type MultiStylePropertyValue = {
  readonly type: "multi";
  readonly identifier: string;
};
export type StylePropertyValue = {
  readonly name: string;
  readonly value: string;
} & (SingleStylePropertyValue | MultiStylePropertyValue);
