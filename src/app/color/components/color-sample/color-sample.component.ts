import { Component, computed, input } from "@angular/core";
import { ColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModelName } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";

@Component({
  selector: "zz-color-sample",
  imports: [ColorSwatchDirective, FormsModule, ReactiveFormsModule, ShadowDirective, RoundedDirective],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  colorChange(_$event: any) {
    throw new Error("Method not implemented.");
  }
  height = input(120);
  model = input<ColorModelName>("rgb");
  Aaxis = input(60, { alias: "componentA" });
  Baxis = input(70, { alias: "componentB" });
  Caxis = input(80, { alias: "componentC" });

  texto = computed(() => {
    const model = namedColorModels[this.model()];
    return model.convert({
      A: this.Aaxis(),
      B: this.Baxis(),
      C: this.Caxis(),
    });
  });
}
