import { FormControl, FormGroup } from "@angular/forms";
import { FontStyleAxeSingle, FontStyleAxeMulti, FontStyleAxeBoolean } from "../font-style/font-axe-types";
import { sliderOptions } from "../../../core/components/slider/slider-types";

export type formWithGroups<T> = { [key: string]: FormControl<T> | FormGroup<keyControl<T>> };

export type keyControl<T> = { [key: string]: FormControl<T> };

type field = {
  fieldName: string;
  caption: string;
};
type propiedadSingle = {
  type: "single";
  parte: parteNumber;
};

type propiedadBoolean = {
  type: "boolean";
  parte: parteBoolean;
};
type propiedadMulti = {
  type: "multi";
  partes: (parteNumber | parteBoolean)[];
};

export type propiedad = {
  name: string;
} & (propiedadSingle | propiedadMulti | propiedadBoolean);

type parteNumber = field &
  sliderOptions & {
    unit?: string;
  };

type parteBoolean = field & {
  defaultValue: boolean;
} & (parteBooleanString | parteBooleanNumber);

type parteBooleanString = {
  falseValue: string;
  trueValue: string;
};
type parteBooleanNumber = {
  falseValue: number;
  trueValue: number;
};

export function createPropiedad(axe: FontStyleAxeBoolean | FontStyleAxeSingle | FontStyleAxeMulti): propiedad {
  if (axe.type === "single") {
    return createPropiedadSingleValue(axe);
  } else if (axe.type === "multi") {
    return createPropiedadMultiValue(axe);
  } else {
    return createPropiedadBooleanValue(axe);
  }
}
function createPropiedadSingleValue(axe: FontStyleAxeSingle): propiedad {
  return {
    type: "single",
    name: axe.name,
    parte: {
      fieldName: axe.name,
      caption: axe.caption,
      ...axe.range,
      unit: axe.unit,
    } as parteNumber,
  };
}

function createPropiedadBooleanValue(axe: FontStyleAxeBoolean): propiedad {
  if (axe.type !== "boolean") {
    throw new Error("Axe must be of type 'boolean'");
  }
  return {
    type: "boolean",
    name: axe.name,
    parte: {
      fieldName: axe.name,
      caption: axe.caption,
      falseValue: axe.falseValue,
      trueValue: axe.trueValue,
      defaultValue: axe.defaultValue ?? false,
    } as parteBoolean,
  };
}
function createPropiedadMultiValue(axe: FontStyleAxeMulti): propiedad {
  const partes = axe.parts.map((part) => {
    if (part.type === "single") {
      const control = new FormControl(part.range.defaultValue, { nonNullable: true });
      return {
        fieldName: part.variation.identifier,
        caption: part.variation.caption,
        ...part.range,
      };
    } else {
      const control = new FormControl<boolean>(part.range.defaultValue, { nonNullable: true });
      return {
        fieldName: part.variation.identifier,
        caption: part.variation.caption,
        ...part.range,
      };
    }
  });

  return {
    type: "multi",
    name: axe.name,
    partes: partes as (parteNumber | parteBoolean)[],
  };
}
