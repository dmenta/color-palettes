import { Component, effect, EventEmitter, input, Output, Signal, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { DualAxisSliderComponent } from "../dual-axis-slider/dual-axis-slider.component";
import { ColorComponent, ColorModel, Triple, Tuple } from "../../model/colors.model";

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
  colorModel = input<ColorModel | undefined>(undefined, { alias: "model" });
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  variable = input<ColorComponent | undefined>(undefined);
  variableIndex = input<0 | 1 | 2 | undefined>(undefined);
  indices: (0 | 1 | 2)[] = [0, 1, 2];

  currentColor = signal<Triple<number>>([0, 0, 0]);

  variableAverage: Signal<number> | undefined = undefined;
  configGroup: FormGroup<{
    v0: FormControl<number>;
    v1: FormControl<number>;
    v2: FormControl<number>;
  }>;

  @Output() colorChange = new EventEmitter<Triple<number>>();
  @Output() rangeChange = new EventEmitter<Tuple<number>>();

  constructor() {
    effect(() => {
      const variable = this.variable();
      if (!variable) {
        return;
      }

      const colorModel = this.colorModel();

      this.currentColor.set(colorModel?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
      this.configGroup.patchValue(
        {
          v0: colorModel?.components[0].defaultValue ?? 0,
          v1: colorModel?.components[1].defaultValue ?? 0,
          v2: colorModel?.components[2].defaultValue ?? 0,
        },
        { emitEvent: true }
      );
    });
  }
  ngOnInit() {
    const colorModel = this.colorModel();

    this.configGroup = new FormGroup({
      v0: new FormControl(colorModel.components[0].defaultValue, { nonNullable: true }),
      v1: new FormControl(colorModel.components[1].defaultValue, { nonNullable: true }),
      v2: new FormControl(colorModel.components[2].defaultValue, { nonNullable: true }),
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
      ["v" + this.variableIndex()]: (minmax[0] + minmax[1]) / 2,
    });
    this.rangeChange.emit(minmax);
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
