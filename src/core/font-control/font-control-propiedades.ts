import { FormControl, FormGroup } from "@angular/forms";
import { Observable, startWith, map, combineLatest } from "rxjs";
import { FontStyleAxeSingle, FontStyleAxeMulti } from "../font-style/font-axe-types";
import { sliderOptions } from "../slider/slider-types";

export type formWithGroups<T> = { [key: string]: FormControl<T> | FormGroup<keyControl<T>> };

type keyControl<T> = { [key: string]: FormControl<T> };

type propiedadSingle = {
  type: "single";
  parte: parte;
  control: FormControl<number>;
};
type propiedadMulti = {
  type: "multi";
  partes: parte[];
  control: FormGroup<keyControl<number>>;
};

type propiedad = {
  name: string;
  value$: Observable<string | null>;
} & (propiedadSingle | propiedadMulti);

type parte = sliderOptions & {
  fieldName: string;
  caption: string;
  unit?: string;
};

export function createPropiedad(axe: FontStyleAxeSingle | FontStyleAxeMulti): propiedad {
  if (axe.type === "single") {
    return createPropiedadSingleValue(axe);
  } else {
    return createPropiedadMultiValue(axe);
  }
}
function createPropiedadSingleValue(axe: FontStyleAxeSingle): propiedad {
  const control = new FormControl(axe.range.defaultValue, { nonNullable: true });

  return {
    name: axe.propiedad.name,
    type: "single",
    parte: {
      fieldName: axe.propiedad.name,
      caption: axe.propiedad.caption,
      ...axe.range,
      unit: axe.unit,
    },
    value$: control.valueChanges.pipe(
      startWith(axe.range.defaultValue),
      map((value) =>
        value === axe.range.defaultValue ? null : `${axe.propiedad.name}: ${axe.propertyValue(value).value}`
      )
    ),
    control: control,
  };
}

function createPropiedadMultiValue(axe: FontStyleAxeMulti): propiedad {
  const partes = axe.parts.map((part) => {
    const control = new FormControl(part.range.defaultValue, { nonNullable: true });
    return {
      fieldName: part.variation.identifier,
      caption: part.variation.caption,
      ...part.range,
      control: control,
      value$: control.valueChanges.pipe(
        startWith(part.range.defaultValue),
        map((value) =>
          value === part.range.defaultValue ? null : part.propertyValue({ [part.variation.identifier]: value })
        )
      ),
    };
  });

  return {
    name: axe.propiedad.name,
    type: "multi",
    partes: partes,
    value$: combineLatest(partes.map((p) => p.value$)).pipe(
      map((values) => {
        const valores = values.filter((v) => v !== null && v !== undefined);
        if (valores.length === 0) {
          return null;
        }
        return `${axe.propiedad.name}: ${valores.join(", ")}`;
      })
    ),
    control: partes.reduce((group, part) => {
      group.addControl(part.fieldName, part.control);
      return group;
    }, new FormGroup<keyControl<number>>({})),
  };
}
