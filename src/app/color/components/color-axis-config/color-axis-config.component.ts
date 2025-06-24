import { Component, EventEmitter, Output } from "@angular/core";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputDirective } from "../../../core/components/select/select.directive";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { SelectComponent } from "../../../core/components/select/select.component";
import { ColorComponent, ColorModel } from "../../model/colors.model";
import { colorModels, namedColorModels } from "../../model/color-models-definitions";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";

@Component({
  selector: "zz-color-axis-config",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PanelDirective,
    ShadowDirective,
    RoundedDirective,
    InputDirective,
    SelectComponent,
    ToggleCheckComponent,
  ],
  templateUrl: "./color-axis-config.component.html",
})
export class ColorAxisConfigComponent {
  models = colorModels;
  configGroup:
    | FormGroup<{
        model: FormControl<ColorModel>;
        variable: FormControl<ColorComponent>;
        pasos: FormControl<number>;
        alto: FormControl<number>;
        continuo: FormControl<boolean>;
      }>
    | undefined = undefined;

  @Output() configChange = new EventEmitter<
    Partial<{
      model: ColorModel;
      variable: ColorComponent;
      pasos: number;
      alto: number;
      continuo: boolean;
    }>
  >();

  ngOnInit() {
    this.configGroup = new FormGroup({
      model: new FormControl<ColorModel>(namedColorModels["rgb"], { nonNullable: true }),
      variable: new FormControl<ColorComponent>(namedColorModels["rgb"].components[0], { nonNullable: true }),
      pasos: new FormControl<number>(10, { nonNullable: true, validators: [Validators.min(1), Validators.max(100)] }),
      alto: new FormControl<number>(100, { nonNullable: true, validators: [Validators.min(1), Validators.max(180)] }),
      continuo: new FormControl<boolean>(false, { nonNullable: true }),
    });

    this.configGroup.controls.model.valueChanges.subscribe((model) => {
      if (model) {
        const variable = model.components[0];
        this.configGroup?.controls.variable.setValue(variable);
      }
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        if (this.configGroup.valid) {
          this.configChange.emit({
            model: value.model,
            variable: value.variable,
            pasos: value.pasos,
            alto: value.alto,
            continuo: value.continuo,
          });
        }
      });
  }
}
