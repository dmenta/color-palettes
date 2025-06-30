import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { InputDirective } from "../../../core/directives/input.directive";
import { SimpleCheckDirective } from "../../../core/directives/simple-check.directive";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-palette-visual-config",
  imports: [FormsModule, ReactiveFormsModule, InputDirective, SimpleCheckDirective],
  templateUrl: "./palette-visual-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteVisualConfigComponent {
  state = inject(ColorStateService);

  configGroup:
    | FormGroup<{
        alto: FormControl<number>;
        continuo: FormControl<boolean>;
        separate: FormControl<boolean>;
      }>
    | undefined = undefined;

  ngOnInit() {
    const visualConfig = this.state.paletteVisualConfig();

    this.configGroup = new FormGroup({
      alto: new FormControl<number>(visualConfig.alto, {
        nonNullable: true,
        validators: [Validators.min(1), Validators.max(180)],
      }),
      continuo: new FormControl<boolean>(visualConfig.continuo, { nonNullable: true }),
      separate: new FormControl<boolean>(visualConfig.separate, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged(
          (prev, curr) => prev.alto === curr.alto && prev.continuo === curr.continuo && prev.separate === curr.separate
        ),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.state.paletteVisualConfigChanged({
            alto: value.alto ?? controls.alto.value,
            continuo: value.continuo ?? controls.continuo.value,
            separate: value.separate ?? controls.separate.value,
          });
        }
      });
  }
}
