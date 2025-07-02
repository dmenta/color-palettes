import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Output } from "@angular/core";
import { SliderFieldComponent } from "../../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ColorValues, MinMax } from "../../../model/colors.model";
import { IconDirective } from "../../../../core/directives/icon.directive";
import { ColorStateService } from "../../../services/color-state.service";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, ColorAxisComponent, ReactiveFormsModule, IconDirective],
  templateUrl: "./dual-axis-slider.component.html",
  host: {
    class: "block w-full",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DualAxisSliderComponent {
  state = inject(ColorStateService);
  currentColor = input<ColorValues | undefined>(undefined, { alias: "current-color" });

  height = input(30, {
    transform: (value?: number) => {
      if (value === undefined) {
        return 30;
      }
      const valor = Number.isInteger(value) ? value : 30;

      return Math.max(1, Math.min(400, valor));
    },
  });

  @Output() minmaxChange = new EventEmitter<MinMax>();

  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }> | undefined = undefined;

  constructor() {
    effect(() => {
      this.formDual?.patchValue(
        {
          min: this.state.colorConfig().minmax[0],
          max: this.state.colorConfig().minmax[1],
        },
        { emitEvent: true }
      );
    });
  }

  ngOnInit() {
    this.formDual = new FormGroup({
      min: new FormControl(this.state.colorConfig().minmax[0], { nonNullable: true }),
      max: new FormControl(this.state.colorConfig().minmax[1], { nonNullable: true }),
    });

    this.formDual.valueChanges.subscribe((value) => {
      this.minmaxChange.emit([
        value.min ?? this.formDual?.controls.min.value ?? 0,
        value.max ?? this.formDual?.controls.max.value ?? 0,
      ]);
    });
  }

  componentStep(precision: number): number {
    return 1 / Math.pow(10, precision);
  }
}
