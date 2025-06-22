import { Component, computed, input } from "@angular/core";
import { ColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ColorModelName, componentKey } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { borderRadius } from "../../../core/directives/rounded.directive";

@Component({
  selector: "zz-color-axis",
  imports: [ColorSwatchDirective],
  templateUrl: "./color-axis.component.html",
})
export class ColorAxisComponent {
  pasos = input(10);

  shadow = input(true);
  rounded = input("large" as borderRadius);

  height = input(50);
  indices = computed(() => Array.from({ length: this.pasos() }, (_, i) => i / this.pasos()));

  variacion = input("A" as componentKey);

  modelName = input("rgb" as ColorModelName);

  model = computed(() => namedColorModels[this.modelName()]);
  componenteVariable = computed(() => this.model().components[this.variacion()]);

  componenteAmin = input(this.model().components.A.min);
  componenteAmax = input(this.model().components.A.max);
  componenteB = input(this.model().components.B.defaultValue);
  componenteC = input(this.model().components.B.defaultValue);
}
