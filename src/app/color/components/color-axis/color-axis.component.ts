import { Component, computed, input, Signal } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ColorComponent, ColorModel, Triple, Tuple } from "../../model/colors.model";
import { borderRadius } from "../../../core/directives/rounded.directive";
import { ColorToContrastPipe, ColorToRgbPipe } from "../color-swatch/color-to-rgb.pipe";

@Component({
  selector: "zz-color-axis",
  imports: [FullWidthColorSwatchDirective, ColorToRgbPipe, ColorToContrastPipe],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });
  model = input<ColorModel>();
  variableComponent = input<ColorComponent | undefined>(undefined);
  variable = input<0 | 1 | 2 | undefined>(undefined);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  showRGB = input(false);
  pasos = input(10);
  fixedValues = input<Tuple<number>>([0, 0]);
  height = input(10);
  width = input<number | "full">("full");

  shadow = input(true);
  rounded = input("large" as borderRadius);

  indices: Signal<{ valores: Triple<number>; color: string }[]> | undefined = undefined;

  ngOnInit() {
    this.indices = computed(() => {
      const model = this.model();
      const baseArray =
        this.colorBase() ??
        ([
          model.components[0].defaultValue,
          model.components[1].defaultValue,
          model.components[2].defaultValue,
        ] as Triple<number>);
      const pasos = this.pasos();
      const step = (this.max() - this.min()) / (pasos - 1);

      return Array.from({ length: pasos }, (_, i) => {
        const value = this.min() + i * step;
        const valores = [...baseArray];
        valores[this.variable()] = value;
        return { valores: valores as Triple<number>, color: model.convert([valores[0], valores[1], valores[2]]) };
      });
    });
  }
}
