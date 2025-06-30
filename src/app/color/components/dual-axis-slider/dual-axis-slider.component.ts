import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Output } from "@angular/core";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Triple, Tuple, VariableConfig } from "../../model/colors.model";
import { IconDirective } from "../../../core/directives/icon.directive";
import { ColorStateService } from "../../services/color-state.service";

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
  currentColor = input<Triple<number> | undefined>(undefined);
  value = input<number | undefined>(undefined);

  height = input(30, {
    transform: (value?: number) => {
      if (value === undefined) {
        return 30;
      }
      const valor = Number.isInteger(value) ? value : 30;

      return Math.max(1, Math.min(400, valor));
    },
  });

  @Output() minmaxChange = new EventEmitter<Tuple<number>>();

  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }> | undefined = undefined;
  init: boolean = false;

  constructor() {
    effect(() => {
      if (!this.init) {
        this.init = true;
        return;
      }

      const minmax = this.minMax(this.state.variableConfig(), this.value());

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
    const minmax = this.state.minmax();

    this.formDual = new FormGroup({
      min: new FormControl(minmax[0], { nonNullable: true }),
      max: new FormControl(minmax[1], { nonNullable: true }),
    });

    this.formDual.valueChanges.subscribe((value) => {
      this.minmaxChange.emit([
        value.min ?? this.formDual?.controls.min.value ?? 0,
        value.max ?? this.formDual?.controls.max.value ?? 0,
      ]);
    });
  }

  minMax(config: VariableConfig | undefined, value: number | undefined) {
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
