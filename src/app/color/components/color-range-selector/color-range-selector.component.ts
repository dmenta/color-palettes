import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { DualAxisSliderComponent } from "../dual-axis-slider/dual-axis-slider.component";
import { Triple, Tuple } from "../../model/colors.model";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-color-range-selector",
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, ColorAxisComponent, DualAxisSliderComponent],
  templateUrl: "./color-range-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorRangeSelectorComponent {
  state = inject(ColorStateService);
  height = 30;
  indices: (0 | 1 | 2)[] = [0, 1, 2];

  configGroup:
    | FormGroup<{
        v0: FormControl<number>;
        v1: FormControl<number>;
        v2: FormControl<number>;
      }>
    | undefined = undefined;

  constructor() {
    effect(() => {
      const color = this.state.colorBase() ?? [0, 0, 0];

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
    const colorBase = this.state.colorBase() ?? [0, 0, 0];
    this.configGroup = new FormGroup({
      v0: new FormControl(colorBase[0], { nonNullable: true }),
      v1: new FormControl(colorBase[1], { nonNullable: true }),
      v2: new FormControl(colorBase[2], { nonNullable: true }),
    });

    this.configGroup.valueChanges.subscribe(() => {
      const { v0, v1, v2 } = this.configGroup?.value ?? { v0: 0, v1: 0, v2: 0 };
      const color: Triple<number> = [v0, v1, v2] as Triple<number>;
      this.state.colorChanged(color);
    });
  }
  onVariableChange(minmax: Tuple<number>) {
    this.configGroup!.patchValue({
      ["v" + this.state.colorConfig()!.variableIndex]: (minmax[0] + minmax[1]) / 2,
    });
    this.state.rangeChanged(minmax);
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
