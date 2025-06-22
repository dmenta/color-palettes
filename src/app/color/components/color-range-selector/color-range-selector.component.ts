import { Component, effect, input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { componentKey } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { DualAxisSliderComponent } from "../dual-axis-slider/dual-axis-slider.component";

@Component({
  selector: "zz-color-range-selector",
  imports: [
    SliderFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    CollapseVerticalDirective,
    PanelDirective,
    ColorAxisComponent,
    DualAxisSliderComponent,
    CollapseVerticalDirective,
  ],
  templateUrl: "./color-range-selector.component.html",
})
export class ColorRangeSelectorComponent {
  onComponentAChange($event: Partial<{ Amin: number; Amax: number }>) {
    this.config.patchValue({
      Amin: $event.Amin ?? this.config.value.Amin,
      Amax: $event.Amax ?? this.config.value.Amax,
    });
  }
  model = input(namedColorModels["oklch"]);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  componentsKeys: componentKey[] = ["A", "B", "C"];

  config = new FormGroup({
    Amin: new FormControl(this.model().components.A.min, { nonNullable: true }),
    Amax: new FormControl(this.model().components.A.max, { nonNullable: true }),
    B: new FormControl(this.model().components.B.defaultValue, { nonNullable: true }),
    C: new FormControl(this.model().components.C.defaultValue, { nonNullable: true }),
  });

  @Output() change = this.config.valueChanges;

  constructor() {
    effect(() => {
      const model = this.model();
      this.config.patchValue({
        Amin: model.components.A.min,
        Amax: model.components.A.max,
        B: model.components.B.defaultValue,
        C: model.components.C.defaultValue,
      });
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
