import { Component, EventEmitter, Output } from "@angular/core";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { AxisConfig } from "../../model/colors.model";
import { InputDirective } from "../../../core/directives/input.directive";

@Component({
  selector: "zz-color-axis-config",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PanelDirective,
    ShadowDirective,
    RoundedDirective,
    InputDirective,
    ToggleCheckComponent,
  ],
  templateUrl: "./color-axis-config.component.html",
})
export class ColorAxisConfigComponent {
  configGroup:
    | FormGroup<{
        alto: FormControl<number>;
        continuo: FormControl<boolean>;
        pasos: FormControl<number>;
        automatico: FormControl<boolean>;
        showRGB: FormControl<boolean>;
      }>
    | undefined = undefined;

  @Output() axisConfigChange = new EventEmitter<AxisConfig>();

  ngOnInit() {
    this.configGroup = new FormGroup({
      alto: new FormControl<number>(100, { nonNullable: true, validators: [Validators.min(1), Validators.max(180)] }),
      continuo: new FormControl<boolean>(false, { nonNullable: true }),
      pasos: new FormControl<number>(15, { nonNullable: true, validators: [Validators.min(2), Validators.max(100)] }),
      automatico: new FormControl<boolean>(true, { nonNullable: true }),
      showRGB: new FormControl<boolean>(false, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        if (this.configGroup.valid) {
          this.axisConfigChange.emit({
            alto: value.alto,
            continuo: value.continuo,
            pasos: value.pasos,
            automatico: value.automatico,
            showRGB: value.showRGB,
          });
        }
      });
  }
}
