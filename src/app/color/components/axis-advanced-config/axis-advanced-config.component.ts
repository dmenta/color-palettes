import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { AxisConfig, showValuesOption } from "../../model/colors.model";
import { InputDirective } from "../../../core/directives/input.directive";
import { SelectComponent } from "../../../core/components/select/select.component";
import { SimpleCheckDirective } from "../../../core/directives/simple-check.directive";

@Component({
  selector: "zz-axis-advanced-config",
  imports: [FormsModule, ReactiveFormsModule, InputDirective, SimpleCheckDirective, SelectComponent],
  templateUrl: "./axis-advanced-config.component.html",
})
export class ColorAxisAdvancedConfigComponent {
  configGroup:
    | FormGroup<{
        alto: FormControl<number>;
        continuo: FormControl<boolean>;
        pasos: FormControl<number>;
        automatico: FormControl<boolean>;
        showValues: FormControl<{ text: string; value: showValuesOption }>;
        separate: FormControl<boolean>;
      }>
    | undefined = undefined;

  @Output() axisConfigChange = new EventEmitter<AxisConfig>();
  showValuesOptions: { text: string; value: showValuesOption }[] = [
    { text: "No", value: "no" },
    { text: "Yes", value: "yes" },
    { text: "RGB", value: "rgb" },
  ];

  ngOnInit() {
    this.configGroup = new FormGroup({
      alto: new FormControl<number>(100, { nonNullable: true, validators: [Validators.min(1), Validators.max(180)] }),
      continuo: new FormControl<boolean>(false, { nonNullable: true }),
      pasos: new FormControl<number>(12, { nonNullable: true, validators: [Validators.min(2), Validators.max(100)] }),
      automatico: new FormControl<boolean>(true, { nonNullable: true }),
      showValues: new FormControl<{ text: string; value: showValuesOption }>(this.showValuesOptions![0]!, {
        nonNullable: true,
      }),
      separate: new FormControl<boolean>(false, { nonNullable: true }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.axisConfigChange.emit({
            alto: value.alto ?? controls.alto.value,
            continuo: value.continuo ?? controls.continuo.value,
            pasos: value.pasos ?? controls.pasos.value,
            automatico: value.automatico ?? controls.automatico.value,
            showValues: value.showValues?.value ?? controls.showValues.value.value,
            separate: value.separate ?? controls.separate.value,
          });
        }
      });
  }
}
