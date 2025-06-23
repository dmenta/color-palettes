import { Component, effect, input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";

@Component({
  selector: "zz-color-selector",
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, PanelDirective, ColorAxisComponent],
  templateUrl: "./color-selector.component.html",
})
export class ColorSelectorComponent {
  model = input(namedColorModels["rgb"]);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  indices: (0 | 1 | 2)[] = [0, 1, 2];
  config = new FormGroup({
    v0: new FormControl(this.model().components[0].defaultValue, { nonNullable: true }),
    v1: new FormControl(this.model().components[1].defaultValue, { nonNullable: true }),
    v2: new FormControl(this.model().components[2].defaultValue, { nonNullable: true }),
  });

  @Output() colorChange = this.config.valueChanges;

  constructor() {
    effect(() => {
      const model = this.model();
      this.config.patchValue({
        v0: model.components[0].defaultValue,
        v1: model.components[1].defaultValue,
        v2: model.components[2].defaultValue,
      });
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
