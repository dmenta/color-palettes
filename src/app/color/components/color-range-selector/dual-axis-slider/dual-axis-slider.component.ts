import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { SliderFieldComponent } from "../../../../core/components/slider-field/slider-field.component";
import { AxisGradientDirective } from "../../../directives/axis-gradient.directive";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ColorValues, Range } from "../../../model/colors.model";
import { ColorStateService } from "../../../services/color-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "zz-dual-axis-slider",
  imports: [SliderFieldComponent, AxisGradientDirective, ReactiveFormsModule],
  templateUrl: "./dual-axis-slider.component.html",
  host: {
    class: "block w-full",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DualAxisSliderComponent implements OnInit, OnDestroy {
  valueChangeSubscription: Subscription | null = null;
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

  @Output() rangeChange = new EventEmitter<Range>();

  formDual: FormGroup<{ min: FormControl<number>; max: FormControl<number> }> | undefined = undefined;

  constructor() {
    effect(() => {
      this.formDual?.patchValue(
        {
          min: this.state.colorConfig().range.min,
          max: this.state.colorConfig().range.max,
        },
        { emitEvent: true }
      );
    });
  }

  ngOnInit() {
    this.formDual = new FormGroup({
      min: new FormControl(this.state.colorConfig().range.min, { nonNullable: true }),
      max: new FormControl(this.state.colorConfig().range.max, { nonNullable: true }),
    });

    this.valueChangeSubscription = this.formDual.valueChanges.subscribe((value) => {
      this.rangeChange.emit({
        min: value.min ?? this.formDual?.controls.min.value ?? 0,
        max: value.max ?? this.formDual?.controls.max.value ?? 0,
      });
    });
  }
  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }
}
