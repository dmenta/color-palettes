import { Component, computed, input } from "@angular/core";
import { ColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ColorModelName, Triple, Tuple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { borderRadius } from "../../../core/directives/rounded.directive";

@Component({
  selector: "zz-color-axis",
  imports: [ColorSwatchDirective],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  modelName = input("rgb" as ColorModelName);
  protected model = computed(() => namedColorModels[this.modelName()]);

  variable = input<0 | 1 | 2>(0);

  fixedIndexs = computed(() => {
    if (this.variable() === 0) {
      return [1, 2];
    } else if (this.variable() === 1) {
      return [0, 2];
    }
    return [0, 1];
  });

  min = input(this.model().components[this.variable()].min);
  max = input(this.model().components[this.variable()].max);
  pasos = input(10);
  fixedValues = input<Tuple<number>>([0, 0]);

  height = input(50);
  width = input<number | "full">("full");

  shadow = input(true);
  rounded = input("large" as borderRadius);

  currentColorBase = computed(() => {
    const variable = this.variable();
    const fixedIndexs = this.fixedIndexs();
    const valores = this.fixedValues();

    const valoresResolved = [0, 0, 0];
    valoresResolved[fixedIndexs[0]] = valores[0];
    valoresResolved[fixedIndexs[1]] = valores[1];
    valoresResolved[variable] = this.min();

    return valoresResolved as Triple<number>;
  });
  protected componenteVariable = computed(() => this.model().components[this.variable()]);
  protected indices = computed(() => {
    const baseArray = this.currentColorBase();
    const pasos = this.pasos();
    const step = (this.max() - this.min()) / (pasos - 1);

    return Array.from({ length: pasos }, (_, i) => {
      const value = this.min() + i * step;
      const valores = [...baseArray];
      valores[this.variable()] = value;
      return valores as Triple<number>;
    });
  });
}
