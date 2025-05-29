type SingleStylePropertyDefinition = {
  readonly type: "single";
  readonly unit?: string;
};

type MultiStylePropertyDefinition = {
  readonly type: "multi";
};

export type StylePropertyDefinition = {
  readonly caption: string;
  readonly name: stylePropertyName;
} & (SingleStylePropertyDefinition | MultiStylePropertyDefinition);

export type stylePropertyName =
  | "font-size"
  | "font-weight"
  | "font-variation-settings"
  | "font-style"
  | "font-stretch"
  | "font-family";

export function stylePropertyValue(
  definition: StylePropertyDefinition,
  value: number | { [key: string]: number }
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
