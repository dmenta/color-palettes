import { Component, effect, EventEmitter, input, Output, signal } from "@angular/core";
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
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);

  width = input<number | "full">("full");

  currentColor = signal<Triple<number>>([0, 0, 0]);

  @Output() minmaxChange = new EventEmitter<Tuple<number>>();

  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }>;

  constructor() {
    effect(() => {
      const variable = this.colorConfig().variable;

      const min = this.min() ?? variable.min;
      const max = this.max() ?? variable.max;

      this.formDual.patchValue(
        {
          min: min,
          max: max,
        },
        { emitEvent: false }
      );
    });
    effect(() => {
      const colorBase = this.colorBase();
      if (colorBase) {
        this.currentColor.set(colorBase);
      } else {
        const model = this.colorConfig().model;
        this.currentColor.set(model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
      }
    });
  }

  ngOnInit() {
    const variable = this.colorConfig().variable;

    const min = this.min() ?? variable.min;
    const max = this.max() ?? variable.max;

    this.formDual = new FormGroup({
      min: new FormControl(min, { nonNullable: true }),
      max: new FormControl(max, { nonNullable: true }),
    });

    this.formDual.valueChanges.subscribe((value) => {
      const colorBase = this.colorBase();
      colorBase[this.colorConfig().variableIndex] = (value.min + value.max) / 2;
      this.currentColor.set(colorBase);

      this.minmaxChange.emit([value.min, value.max]);
    });

    const model = this.colorConfig().model;
    const colorBase = this.colorBase();

    this.currentColor.set(colorBase ?? model.defaultValues() ?? ([0, 0, 0] as Triple<number>));
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
