import { Component, computed, effect, input, Output, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  onComponentAChange($event: Partial<{ min: number; max: number }>) {
    this.config.patchValue({
      min: $event.min ?? this.config.value.min,
      max: $event.max ?? this.config.value.max,
    });
    this.minmax.set({
      min: $event.min ?? this.minmax().min,
      max: $event.max ?? this.minmax().max,
    });
  }

  model = input(namedColorModels["oklch"]);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  variable = input<0 | 1 | 2>(0);

  fixedIndexs = computed(() => {
    if (this.variable() === 0) {
      return [1, 2];
    } else if (this.variable() === 1) {
      return [0, 2];
    }
    return [0, 1];
  });
  indices: (0 | 1 | 2)[] = [0, 1, 2];

  minmax = signal({
    min: this.model().components[this.variable()].min,
    max: this.model().components[this.variable()].max,
  });
  variableAverage = computed(() =>
    this.model().components[this.variable()].average(this.minmax().min, this.minmax().max)
  );

  config = new FormGroup({
    min: new FormControl(this.model().components[this.variable()].min, { nonNullable: true }),
    max: new FormControl(500, { nonNullable: true }),
    f0: new FormControl(this.model().components[this.fixedIndexs()[0]].defaultValue, { nonNullable: true }),
    f1: new FormControl(this.model().components[this.fixedIndexs()[1]].defaultValue, { nonNullable: true }),
  });

  @Output() colorChange = this.config.valueChanges;

  constructor() {
    effect(() => {
      const model = this.model();
      this.config.patchValue({
        min: model.components[this.variable()].min,
        max: model.components[this.variable()].max,
        f0: model.components[this.fixedIndexs()[0]].defaultValue,
        f1: model.components[this.fixedIndexs()[1]].defaultValue,
      });
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
