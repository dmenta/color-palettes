import { Component, effect, EventEmitter, input, Output, Signal, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { DualAxisSliderComponent } from "../dual-axis-slider/dual-axis-slider.component";
import { AxisConfig, ColorConfig, Triple, Tuple } from "../../model/colors.model";
import { startWith } from "rxjs";

@Component({
  selector: "zz-color-range-selector",
  imports: [
    SliderFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    PanelDirective,
    ColorAxisComponent,
    DualAxisSliderComponent,
  ],
  templateUrl: "./color-range-selector.component.html",
})
export class ColorRangeSelectorComponent {
  colorConfig = input<ColorConfig | undefined>(undefined, { alias: "color-config" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  currentColor = signal<Triple<number>>([0, 0, 0]);

  @Output() colorChange = new EventEmitter<Triple<number>>();
  @Output() rangeChange = new EventEmitter<Tuple<number>>();

  indices: (0 | 1 | 2)[] = [0, 1, 2];

  configGroup: FormGroup<{
    v0: FormControl<number>;
    v1: FormControl<number>;
    v2: FormControl<number>;
  }>;

  constructor() {
    effect(() => {
      const color = this.colorBase();

      this.configGroup.patchValue(
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
    this.configGroup = new FormGroup({
      v0: new FormControl(this.colorBase()[0], { nonNullable: true }),
      v1: new FormControl(this.colorBase()[1], { nonNullable: true }),
      v2: new FormControl(this.colorBase()[2], { nonNullable: true }),
    });

    this.configGroup.valueChanges.subscribe(() => {
      const { v0, v1, v2 } = this.configGroup.value;
      const color: Triple<number> = [v0, v1, v2] as Triple<number>;
      this.currentColor.set(color);
      this.colorChange.emit(color);
    });
  }
  onVariableChange(minmax: Tuple<number>) {
    this.configGroup.patchValue({
      ["v" + this.colorConfig().variableIndex]: (minmax[0] + minmax[1]) / 2,
    });
    this.rangeChange.emit(minmax);
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
