import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { InputDirective } from "../../../core/directives/input.directive";
import { SimpleCheckDirective } from "../../../core/directives/simple-check.directive";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-palette-steps-config",
  imports: [FormsModule, ReactiveFormsModule, InputDirective, SimpleCheckDirective],
  templateUrl: "./palette-steps-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteStepsConfigComponent {
  state = inject(ColorStateService);

  configGroup:
    | FormGroup<{
        pasos: FormControl<number>;
        automatico: FormControl<boolean>;
      }>
    | undefined = undefined;

  ngOnInit() {
    const stepsConfig = this.state.paletteStepsConfig();
    this.configGroup = new FormGroup({
      pasos: new FormControl<number>(stepsConfig.pasos, {
        nonNullable: true,
        validators: [Validators.min(2), Validators.max(100)],
      }),
      automatico: new FormControl<boolean>(stepsConfig.automatico, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged((prev, curr) => prev.pasos === curr.pasos && prev.automatico === curr.automatico),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.state.paletteStepsConfigChanged({
            pasos: value.pasos ?? controls.pasos.value,
            automatico: value.automatico ?? controls.automatico.value,
          });
        }
      });
  }
}
