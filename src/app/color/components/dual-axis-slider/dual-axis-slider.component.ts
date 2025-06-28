import { Component, effect, EventEmitter, input, Output } from "@angular/core";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AxisConfig, ColorConfig, Triple, Tuple } from "../../model/colors.model";
import { IconDirective } from "../../../core/components/icon/icon.directive";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, ColorAxisComponent, ReactiveFormsModule, IconDirective],
  templateUrl: "./dual-axis-slider.component.html",
  host: {
    class: "block w-full",
  },
})
export class DualAxisSliderComponent {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });
  currentColor = input<Triple<number> | undefined>(undefined);
  value = input<number | undefined>(undefined);

  width = input<number | "full">("full");

  @Output() minmaxChange = new EventEmitter<Tuple<number>>();

  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }> | undefined = undefined;

  constructor() {
    effect(() => {
      const minmax = this.minMax(this.colorConfig(), this.value());

      this.formDual?.patchValue(
        {
          min: minmax.min,
          max: minmax.max,
        },
        { emitEvent: true }
      );
    });
  }

  ngOnInit() {
    const minmax = this.minMax(this.colorConfig(), this.value());

    this.formDual = new FormGroup({
      min: new FormControl(minmax.min, { nonNullable: true }),
      max: new FormControl(minmax.max, { nonNullable: true }),
    });

    this.formDual.valueChanges.subscribe((value) => {
      this.minmaxChange.emit([
        value.min ?? this.formDual?.controls.min.value ?? 0,
        value.max ?? this.formDual?.controls.max.value ?? 0,
      ]);
    });
  }

  minMax(config: ColorConfig | undefined, value: number | undefined) {
    if (config === undefined || value === undefined) {
      return {
        min: 0,
        max: 0,
      };
    }

    const middle = (config.variable.max + config.variable.min) / 2;
    const max = value > middle ? config.variable.max : value * 2 - config.variable.min;
    const min = value < middle ? config.variable.min : value * 2 - config.variable.max;

    return {
      min: min,
      max: max,
    };
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
