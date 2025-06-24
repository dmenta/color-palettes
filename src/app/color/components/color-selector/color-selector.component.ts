import { Component, effect, EventEmitter, input, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { ColorModel, Triple } from "../../model/colors.model";

@Component({
  selector: "zz-color-selector",
  imports: [SliderFieldComponent, FormsModule, ReactiveFormsModule, PanelDirective, ColorAxisComponent],
  templateUrl: "./color-selector.component.html",
})
export class ColorSelectorComponent {
  colorModel = input<ColorModel | undefined>(undefined, { alias: "model" });
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  indices: (0 | 1 | 2)[] = [0, 1, 2];

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
      this.colorChange.emit([valores.v0, valores.v1, valores.v2]);
    });
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
