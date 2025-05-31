type SingleStylePropertyDefinition = {
  readonly type: "single";
  readonly unit?: string;
};

type MultiStylePropertyDefinition = {
  readonly type: "multi";
};

type StyleBooleanPropertyDefinition<T extends string | number = string | number> = {
  readonly type: "boolean";
  onValue: T;
  offValue: T;
};

export type StylePropertyDefinition<T extends string | number = string | number> = {
  readonly caption: string;
  readonly name: stylePropertyName;
} & (SingleStylePropertyDefinition | MultiStylePropertyDefinition | StyleBooleanPropertyDefinition<T>);

export type stylePropertyName =
  | "font-size"
  | "font-weight"
  | "font-variation-settings"
  | "font-style"
  | "font-stretch"
  | "font-family";

export function stylePropertyValue<T extends string | number = string | number>(
  definition: StylePropertyDefinition<T>,
  value: number | { [key: string]: T }
): StylePropertyValue {
  if (definition.type === "single") {
    return {
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
  readonly name: stylePropertyName;
  readonly value: string;
};
