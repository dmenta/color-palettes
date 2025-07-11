import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { AxisGradientDirective } from "../../directives/axis-gradient.directive";
import { DualAxisSliderComponent } from "./dual-axis-slider/dual-axis-slider.component";
import { ColorValueKey, ColorValues, Range } from "../../model/colors.model";
import { ColorStateService } from "../../services/color-state.service";
import { Subscription } from "rxjs";

@Component({
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, AxisGradientDirective, DualAxisSliderComponent],
  selector: "zz-color-range-selector",
  templateUrl: "./color-range-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorRangeSelectorComponent implements OnInit, OnDestroy {
  valueChangeSubscription: Subscription | null = null;
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

      const colorOrig = config.color ?? [0, 0, 0];
      let v0 = colorOrig[0];
      let v1 = colorOrig[1];

      const indice = config.variableIndex;

      if (indice === 0) {
        v0 = colorOrig[1];
        v1 = colorOrig[2];
      } else if (indice === 1) {
        v1 = colorOrig[2];
      }

      this.configGroup?.patchValue(
        {
          v0: v0,
          v1: v1,
          v2: colorOrig[config.variableIndex],
        },
        { emitEvent: true }
      );
    });
  }

  ngOnInit() {
    const currentColor = this.state.colorConfig().color ?? [0, 0, 0];

    this.configGroup = new FormGroup({
      v0: new FormControl(currentColor[0], { nonNullable: true }),
      v1: new FormControl(currentColor[1], { nonNullable: true }),
      v2: new FormControl(currentColor[2], { nonNullable: true }),
    });

    this.valueChangeSubscription = this.configGroup.valueChanges.subscribe(() => {
      const { v0, v1, v2 } = this.configGroup?.value ?? { v0: 0, v1: 0, v2: 0 };
      const color: ColorValues = [v0, v1, v2] as ColorValues;

      const indice = this.state.colorConfig().variableIndex;

      color[indice] = v2!;
      v2;
      if (indice === 0) {
        color[1] = v0!;
        color[2] = v1!;
      } else if (indice === 1) {
        color[2] = v1!;
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
  ngOnDestroy() {
    this.valueChangeSubscription?.unsubscribe();
  }
}
