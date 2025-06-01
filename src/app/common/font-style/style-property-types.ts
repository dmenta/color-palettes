type SingleStyleProperty = {
  readonly type: "single";
  readonly datatype: "number";
  readonly unit?: string;
};

type MultiStyleProperty = {
  readonly type: "multi";
};

type StyleBooleanProperty = {
  readonly type: "boolean";
} & (StyleBooleanStringProperty | StyleBooleanNumberProperty);

type StyleBooleanStringProperty = {
  readonly datatype: "string";
  trueValue: string;
  falseValue: string;
};
type StyleBooleanNumberProperty = {
  readonly datatype: "number";
  trueValue: number;
  falseValue: number;
};

export type StyleProperty = {
  readonly caption: string;
  readonly name: string;
} & (SingleStyleProperty | MultiStyleProperty | StyleBooleanProperty);

export function stylePropertyValue(
  definition: StyleProperty,
  value: number | boolean | { [key: string]: number }
): StylePropertyValue {
  if (definition.type === "single") {
    return {
      type: "single",
      name: definition.name,
      value: `${value as number}${definition.unit ?? ""}`,
    };
  }

  throw new Error("Invalid property type");
}

export function variationValue(identifier: string, value: { [key: string]: number }): string {
  return `${identifier} ${value[identifier] ?? 0}`;
}

export type StylePropertyValue = {
  readonly name: string;
  readonly value: string;
  readonly type: "single" | "multi" | "boolean";
};
