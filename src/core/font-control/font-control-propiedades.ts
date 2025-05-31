import { FormControl, FormGroup } from "@angular/forms";
import { FontStyleAxeSingle, FontStyleAxeMulti, FontStyleAxeBoolean } from "../font-style/font-axe-types";
import { sliderOptions } from "../components/slider/slider-types";

export type formWithGroups<T> = { [key: string]: FormControl<T> | FormGroup<keyControl<T>> };

export type keyControl<T> = { [key: string]: FormControl<T> };

type propiedadSingle = {
  type: "single";
  parte: parteNumber;
  control: FormControl<number>;
};

type propiedadBoolean<T extends string | number> = {
  type: "boolean";
  parte: parteBoolean<T>;
  control: FormControl<boolean>;
};
type propiedadMulti = {
  type: "multi";
  partes: (parteNumber | parteBoolean<string | number>)[];
  control: FormGroup<keyControl<number> | keyControl<boolean>>;
};

export type propiedad<T extends string | number> = {
  name: string;
} & (propiedadSingle | propiedadMulti | propiedadBoolean<T>);

type parteNumber = sliderOptions & {
  fieldName: string;
  caption: string;
  unit?: string;
  control?: FormControl<number>;
};

type parteBoolean<T extends string | number> = {
  fieldName: string;
  caption: string;
  off: T;
  on: T;
  defaultValue: boolean;
  control?: FormControl<boolean>;
};
export function createPropiedad<T extends string | number>(
  axe: FontStyleAxeBoolean<T> | FontStyleAxeSingle | FontStyleAxeMulti
): propiedad<T> {
  if (axe.type === "single") {
    return createPropiedadSingleValue(axe) as propiedad<T>;
  } else if (axe.type === "multi") {
    return createPropiedadMultiValue(axe) as propiedad<T>;
  } else {
    return createPropiedadBooleanValue(axe) as propiedad<T>;
  }
}
function createPropiedadSingleValue(axe: FontStyleAxeSingle): propiedad<number> {
  const control = new FormControl(axe.range.defaultValue, { nonNullable: true });

  return {
    name: axe.propiedad.name,
    type: "single",
    parte: {
      fieldName: axe.propiedad.name,
      caption: axe.propiedad.caption,
      ...axe.range,
      unit: axe.unit,
    } as parteNumber,
    control: control,
  };
}

function createPropiedadBooleanValue<T extends string | number>(axe: FontStyleAxeBoolean<T>): propiedad<T> {
  const control = new FormControl(axe.defaultValue ?? false, { nonNullable: true });

  if (axe.type !== "boolean") {
    throw new Error("Axe must be of type 'boolean'");
  }
  return {
    name: axe.propiedad.name,
    type: "boolean",
    parte: {
      fieldName: axe.propiedad.name,
      caption: axe.propiedad.caption,
      off: axe.offValue,
      on: axe.onValue,
      defaultValue: axe.defaultValue ?? false,
    } as parteBoolean<T>,
    control: control,
  };
}
function createPropiedadMultiValue(axe: FontStyleAxeMulti): propiedad<string> {
  const partes = axe.parts.map((part) => {
    if (part.type === "continuo") {
      const control = new FormControl(part.range.defaultValue, { nonNullable: true });
      return {
        fieldName: part.variation.identifier,
        caption: part.variation.caption,
        ...part.range,
        control: control,
      };
    } else {
      const control = new FormControl<boolean>(part.range.defaultValue, { nonNullable: true });
      return {
        fieldName: part.variation.identifier,
        caption: part.variation.caption,
        ...part.range,
        control: control,
      };
    }
  });

  return {
    name: axe.propiedad.name,
    type: "multi",
    partes: partes as (parteNumber | parteBoolean<string | number>)[],
    control: partes.reduce((group, part) => {
      group.addControl(part.fieldName, part.control);
      return group;
    }, new FormGroup<keyControl<number> | keyControl<boolean>>({})),
  };
}
