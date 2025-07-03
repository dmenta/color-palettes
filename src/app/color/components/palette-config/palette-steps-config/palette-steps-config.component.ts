import { ChangeDetectionStrategy, Component, effect, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { InputDirective } from "../../../../core/directives/input.directive";
import { ColorStateService } from "../../../services/color-state.service";

@Component({
  selector: "zz-palette-steps-config",
  imports: [FormsModule, ReactiveFormsModule, InputDirective],
  templateUrl: "./palette-steps-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteStepsConfigComponent {
  state = inject(ColorStateService);

  configGroup:
    | FormGroup<{
        steps: FormControl<number>;
        automatic: FormControl<boolean>;
      }>
    | undefined = undefined;

  constructor() {
    effect(() => {
      const config = this.state.paletteStepsConfig();
      if (config.steps !== this.configGroup?.controls.steps.value) {
        this.configGroup?.controls.steps.setValue(config.steps, { emitEvent: false });
      }
      if (config.automatic !== this.configGroup?.controls.automatic.value) {
        this.configGroup?.controls.automatic.setValue(config.automatic, { emitEvent: false });
      }
    });
  }
  ngOnInit() {
    const stepsConfig = this.state.paletteStepsConfig();
    this.configGroup = new FormGroup({
      steps: new FormControl<number>(stepsConfig.steps, {
        nonNullable: true,
        validators: [Validators.min(2), Validators.max(100)],
      }),
      automatic: new FormControl<boolean>(stepsConfig.automatic, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged((prev, curr) => prev.steps === curr.steps && prev.automatic === curr.automatic),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.state.paletteStepsConfigChanged({
            steps: value.steps ?? controls.steps.value,
            automatic: value.automatic ?? controls.automatic.value,
          });
        }
      });
  }
}
