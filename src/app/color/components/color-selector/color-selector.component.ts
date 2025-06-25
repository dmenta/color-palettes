import { Component, effect, EventEmitter, input, Output, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { AxisConfig, ColorModel, Triple } from "../../model/colors.model";

@Component({
  selector: "zz-color-selector",
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, PanelDirective, ColorAxisComponent],
  templateUrl: "./color-selector.component.html",
})
export class ColorSelectorComponent {
  colorModel = input<ColorModel | undefined>(undefined, { alias: "model" });
  axisConfig = input<AxisConfig | undefined>(undefined, { alias: "axis-config" });

  width = input<number | "full">("full");

  indices: (0 | 1 | 2)[] = [0, 1, 2];
  currentColor = signal<Triple<number>>([0, 0, 0]);

  @Output() colorChange = new EventEmitter<Triple<number>>();
  config: FormGroup<{ v0: FormControl<any>; v1: FormControl<any>; v2: FormControl<any> }>;

  constructor() {
    effect(() => {
      const model = this.colorModel();
      this.config.patchValue({
        v0: model.components[0].defaultValue,
        v1: model.components[1].defaultValue,
        v2: model.components[2].defaultValue,
      });
    });
  }
  ngOnInit() {
    this.config = new FormGroup({
      v0: new FormControl(this.colorModel()?.components[0].defaultValue, { nonNullable: true }),
      v1: new FormControl(this.colorModel()?.components[1].defaultValue, { nonNullable: true }),
      v2: new FormControl(this.colorModel()?.components[2].defaultValue, { nonNullable: true }),
    });

    this.config.valueChanges.subscribe((valores) => {
      const { v0, v1, v2 } = valores;

      const color: Triple<number> = [v0, v1, v2] as Triple<number>;
      this.currentColor.set(color);
      this.colorChange.emit(color);
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
