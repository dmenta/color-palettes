import { Component, computed, input, Output } from "@angular/core";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { borderRadius } from "../../../core/directives/rounded.directive";
import { Tuple } from "../../model/colors.model";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, ColorAxisComponent, ReactiveFormsModule],
  templateUrl: "./dual-axis-slider.component.html",
})
export class DualAxisSliderComponent {
  model = input(namedColorModels["rgb"]);
  shadow = input(true);
  rounded = input("large" as borderRadius);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);
  min = input(0);
  max = input(400);
  fixedValues = input<Tuple<number>>([0, 0]);
  variable = input<0 | 1 | 2>(0);

  variableComponent = computed(() => this.model().components[this.variable()]);

  formDual = new FormGroup({
    min: new FormControl(this.model().components[this.variable()].min, { nonNullable: true }),
    max: new FormControl(360, { nonNullable: true }),
  });

  @Output() colorChange = this.formDual.valueChanges;

  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
