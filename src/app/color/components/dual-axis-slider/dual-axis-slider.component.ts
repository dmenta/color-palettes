import { Component, computed, input, Output } from "@angular/core";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { borderRadius } from "../../../core/directives/rounded.directive";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, ColorAxisComponent, ReactiveFormsModule],
  templateUrl: "./dual-axis-slider.component.html",
})
export class DualAxisSliderComponent {
  model = input(namedColorModels["oklch"]);
  shadow = input(true);
  rounded = input("large" as borderRadius);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);
  AaxisMin = input(0);
  AaxisMax = input(100);
  Baxis = input(50);
  Caxis = input(50);

  componentA = computed(() => this.model().components.A);

  formDual = new FormGroup({
    Amin: new FormControl(this.model().components.A.min, { nonNullable: true }),
    Amax: new FormControl(this.model().components.A.max, { nonNullable: true }),
  });

  @Output() change = this.formDual.valueChanges;

  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
