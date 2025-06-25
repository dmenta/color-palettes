import { Component, EventEmitter, input, Output } from "@angular/core";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectComponent } from "../../../core/components/select/select.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { colorModels, namedColorModels } from "../../model/color-models-definitions";
import { ColorComponent, ColorConfig, ColorModel } from "../../model/colors.model";
import { merge, startWith, tap } from "rxjs";

@Component({
  selector: "zz-color-config",
  imports: [FormsModule, ReactiveFormsModule, SelectComponent, PanelDirective, ShadowDirective, RoundedDirective],
  templateUrl: "./color-config.component.html",
})
export class ColorConfigComponent {
  models = colorModels;
  variableSelection = input(true);

  configGroup:
    | FormGroup<{
        model: FormControl<ColorModel>;
        variable: FormControl<ColorComponent>;
      }>
    | undefined = undefined;

  @Output() colorConfigChange = new EventEmitter<ColorConfig>();

  ngOnInit() {
    this.configGroup = new FormGroup({
      model: new FormControl<ColorModel>(namedColorModels["oklch"], { nonNullable: true }),
      variable: new FormControl<ColorComponent>(
        { value: namedColorModels["oklch"].components[0], disabled: !this.variableSelection() },
        { nonNullable: true }
      ),
    });

    merge(
      this.configGroup.controls.model.valueChanges.pipe(
        tap((model) => {
          if (model) {
            const variable = model.components[0];
            this.configGroup?.controls.variable.setValue(variable);
          }
        })
      ),
      this.configGroup.controls.variable.valueChanges
    )
      .pipe(startWith(this.configGroup.value))
      .subscribe(() => {
        const model = this.configGroup.controls.model.value;
        const variable = this.configGroup.controls.variable.value;
        this.colorConfigChange.emit({
          model: model,
          variable: variable,
          variableIndex: model.components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2,
        });
      });
  }
}
