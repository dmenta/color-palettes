import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { AxisGradientDirective } from "../../directives/axis-gradient.directive";
import { DualAxisSliderComponent } from "./dual-axis-slider/dual-axis-slider.component";
import { ColorValueKey, ColorValues, Range } from "../../model/colors.model";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, AxisGradientDirective, DualAxisSliderComponent],
  selector: "zz-color-range-selector",
  templateUrl: "./color-range-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorRangeSelectorComponent {
  state = inject(ColorStateService);
  height = 30;
  indices: ColorValueKey[] = [0, 1, 2];

  configGroup:
    | FormGroup<{
        v0: FormControl<number>;
        v1: FormControl<number>;
        v2: FormControl<number>;
      }>
    | undefined = undefined;

  constructor() {
    effect(() => {
      const config = this.state.colorConfig();

      const color = config.color ?? [0, 0, 0];
      const indice = config.variableIndex;

      if (indice === 0) {
        const mover = color[0];
        color[0] = color[1];
        color[1] = color[2];
        color[2] = mover;
      } else if (indice === 1) {
        const mover = color[1];
        color[1] = color[2];
        color[2] = mover;
      }
      this.configGroup?.patchValue(
        {
          v0: color[0],
          v1: color[1],
          v2: color[2],
        },
        { emitEvent: true }
      );
    });
  }

  ngOnInit() {
    const currentColor = this.state.colorConfig().color ?? [0, 0, 0];
    console.debug("ColorRangeSelectorComponent: currentColor", currentColor);
    this.configGroup = new FormGroup({
      v0: new FormControl(currentColor[0], { nonNullable: true }),
      v1: new FormControl(currentColor[1], { nonNullable: true }),
      v2: new FormControl(currentColor[2], { nonNullable: true }),
    });

    this.configGroup.valueChanges.subscribe(() => {
      const { v0, v1, v2 } = this.configGroup?.value ?? { v0: 0, v1: 0, v2: 0 };
      const color: ColorValues = [v0, v1, v2] as ColorValues;

      const indice = this.state.colorConfig().variableIndex;
      if (indice === 0) {
        const mover = color[2];
        color[2] = color[1];
        color[1] = color[0];
        color[0] = mover;
      } else if (indice === 1) {
        const mover = color[2];
        color[2] = color[1];
        color[1] = mover;
      }
      this.state.colorChanged(color);
    });
  }
  onVariableChange(range: Range) {
    this.state.rangeChanged(range);
    this.configGroup!.patchValue(
      {
        ["v2"]: (range.min + range.max) / 2,
      },
      { emitEvent: true }
    );
  }
}
