import { Component, effect, input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { componentKey } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";

@Component({
  selector: "zz-color-selector",
  imports: [
    SliderFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    CollapseVerticalDirective,
    PanelDirective,
    ColorAxisComponent,

    CollapseVerticalDirective,
  ],
  templateUrl: "./color-selector.component.html",
})
export class ColorSelectorComponent {
  model = input(namedColorModels["rgb"]);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  componentsKeys: componentKey[] = ["A", "B", "C"];

  config = new FormGroup({
    A: new FormControl(this.model().components.A.defaultValue, { nonNullable: true }),
    B: new FormControl(this.model().components.B.defaultValue, { nonNullable: true }),
    C: new FormControl(this.model().components.C.defaultValue, { nonNullable: true }),
  });

  @Output() change = this.config.valueChanges;

  constructor() {
    effect(() => {
      const model = this.model();
      this.config.patchValue({
        A: model.components.A.defaultValue,
        B: model.components.B.defaultValue,
        C: model.components.C.defaultValue,
      });
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
