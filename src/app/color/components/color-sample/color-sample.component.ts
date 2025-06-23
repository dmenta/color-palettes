import { Component, computed, input } from "@angular/core";
import { SquareColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModelName, Triple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";

@Component({
  selector: "zz-color-sample",
  imports: [SquareColorSwatchDirective, FormsModule, ReactiveFormsModule, ShadowDirective, RoundedDirective],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  model = input<ColorModelName>("rgb");

  values = input<Triple<number>>([0, 0, 0]);

  texto = computed(() => {
    const model = namedColorModels[this.model()];
    return model.convert(this.values());
  });
}
