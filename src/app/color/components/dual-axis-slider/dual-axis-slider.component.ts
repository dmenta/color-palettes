import { Component, effect, EventEmitter, input, Output, signal } from "@angular/core";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { borderRadius } from "../../../core/directives/rounded.directive";
import { ColorComponent, ColorModel, Triple, Tuple } from "../../model/colors.model";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, ColorAxisComponent, ReactiveFormsModule],
  templateUrl: "./dual-axis-slider.component.html",
})
export class DualAxisSliderComponent {
  colorBase = input<Triple<number> | undefined>(undefined, { alias: "color-base" });
  colorModel = input<ColorModel | undefined>(undefined, { alias: "model" });
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  variableIndex = input<0 | 1 | 2>(0);

  variable = input<ColorComponent | undefined>(undefined);
  shadow = input(true);
  rounded = input("large" as borderRadius);
  width = input<number | "full">("full");
  height = input(75);
  pasos = input(10);
  continuo = input(false);

  currentColor = signal<Triple<number>>([0, 0, 0]);

  @Output() minmaxChange = new EventEmitter<Tuple<number>>();
  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }>;

  constructor() {
    effect(() => {
      const variable = this.variable();

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
        const model = this.colorModel();
        this.currentColor.set(model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
      }
    });
  }

  ngOnInit() {
    const variable = this.variable();

    const min = this.min() ?? variable.min;
    const max = this.max() ?? variable.max;

    this.formDual = new FormGroup({
      min: new FormControl(min, { nonNullable: true }),
      max: new FormControl(max, { nonNullable: true }),
    });

    this.formDual.valueChanges.subscribe((value) => {
      const colorBase = this.colorBase();
      colorBase[this.variableIndex()] = (value.min + value.max) / 2;
      this.currentColor.set(colorBase);

      this.minmaxChange.emit([value.min, value.max]);
    });

    const model = this.colorModel();
    const colorBase = this.colorBase();

    this.currentColor.set(colorBase ?? model.defaultValues() ?? ([0, 0, 0] as Triple<number>));
  }
  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
