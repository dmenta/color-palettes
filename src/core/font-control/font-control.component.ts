import { Component, input, linkedSignal, output } from "@angular/core";
import { SliderFieldComponent } from "../slider-field/slider-field.component";
import { FontStyleAxe } from "../font-style/font-axe-types";

@Component({
  selector: "app-font-control",
  imports: [SliderFieldComponent],
  template: `
    <div class="border-1 p-4 rounded-lg  border-black/10 dark:border-white/10 dark:bg-gray-300/5 bg-gray-300/5">
      <h3 class="text-2xl mb-4">{{ fontFamily() }}</h3>
      @for(axe of axes(); track axe.definition.caption) {
      <app-slider-field
        [id]="'font-control-' + axe.definition.caption"
        [disabled]="false"
        [min]="axe.options.range.min"
        [max]="axe.options.range.max"
        [step]="axe.options.step"
        [stops]="axe.options.stops"
        [value]="currentValues()[axe.definition.caption]!"
        [labelLength]="labelLength()"
        [label]="axe.definition.caption"
        [showLabel]="true"
        [valueLength]="valueTextLength()"
        [suffix]="axe.definition.suffix"
        [showValue]="true"
        (valueChanged)="onValueChange(axe, $event)">
      </app-slider-field>
      }
    </div>
  `,
})
export class FontControlComponent {
  readonly fontFamily = input.required<string>();
  readonly axes = input.required<FontStyleAxe[]>();
  readonly labelLength = input(4, { transform: (value: number) => Math.max(1, value ?? 5) });
  readonly valueTextLength = input(5, { transform: (value: number) => Math.max(1, value ?? 5) });
  readonly styleChanged = output<string>();

  protected readonly currentValues = linkedSignal({
    source: this.axes,
    computation: (axes) => Object.fromEntries(axes.map((axe) => [axe.definition.caption, axe.options.initialValue])),
  });

  private readonly estilo = linkedSignal({
    source: this.fontFamily,
    computation: (fontFamily) => this.crearEstilos(fontFamily),
  });

  protected crearEstilos(fontFamily: string) {
    const nuevo = new Map<string, string[]>();
    nuevo.set("font-family", [fontFamily]);

    this.axes().forEach((axe) => {
      const valor = axe.propertyValue(axe.options.initialValue);

      if (valor.type === "single") {
        nuevo.set(valor.name, [valor.value]);
      } else {
        const valores = nuevo.get(valor.name)?.filter((prop) => !prop.startsWith(valor.identifier)) ?? [];
        nuevo.set(valor.name, [...valores, valor.value]);
      }
    });

    this.styleChanged.emit(
      Array.from(nuevo.entries())
        .map(([property, curr]) => {
          return `${property}: ${curr.join(", ")}`;
        })
        .join("; ")
    );

    return nuevo;
  }

  protected onValueChange(axe: FontStyleAxe, value: number) {
    this.currentValues.update((current) => {
      current[axe.definition.caption] = value;
      return current;
    });

    this.updateStyle(axe, value);
  }

  protected updateStyle(axe: FontStyleAxe, value: number) {
    const valor = axe.propertyValue(value);

    if (valor.type === "single") {
      this.estilo().set(valor.name, [valor.value]);
    } else {
      const valores =
        this.estilo()
          .get(valor.name)
          ?.filter((prop) => !prop.startsWith(valor.identifier)) ?? [];
      this.estilo().set(valor.name, [...valores, valor.value]);
    }

    this.styleChanged.emit(
      Array.from(this.estilo().entries())
        .map(([property, curr]) => {
          return `${property}: ${curr.join(", ")}`;
        })
        .join("; ")
    );
  }
}
