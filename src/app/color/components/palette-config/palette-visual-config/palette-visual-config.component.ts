import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { InputDirective } from "../../../../core/directives/input.directive";
import { ColorStateService } from "../../../services/color-state.service";

@Component({
  selector: "zz-palette-visual-config",
  imports: [FormsModule, ReactiveFormsModule, InputDirective],
  templateUrl: "./palette-visual-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteVisualConfigComponent {
  state = inject(ColorStateService);

  configGroup:
    | FormGroup<{
        height: FormControl<number>;
        flat: FormControl<boolean>;
        separate: FormControl<boolean>;
      }>
    | undefined = undefined;

  ngOnInit() {
    const visualConfig = this.state.paletteVisualConfig();

    this.configGroup = new FormGroup({
      height: new FormControl<number>(visualConfig.height, {
        nonNullable: true,
        validators: [Validators.min(1), Validators.max(180)],
      }),
      flat: new FormControl<boolean>(visualConfig.flat, { nonNullable: true }),
      separate: new FormControl<boolean>(visualConfig.separate, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged(
          (prev, curr) => prev.height === curr.height && prev.flat === curr.flat && prev.separate === curr.separate
        ),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.state.paletteVisualConfigChanged({
            height: value.height ?? controls.height.value,
            flat: value.flat ?? controls.flat.value,
            separate: value.separate ?? controls.separate.value,
          });
        }
      });
  }
}
