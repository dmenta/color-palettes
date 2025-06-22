import { Component, Output, signal } from "@angular/core";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectComponent } from "../../../core/components/select/select.component";
import { InputDirective } from "../../../core/components/select/select.directive";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { colorModels, namedColorModels } from "../../model/color-models-definitions";
import { ColorModel, componentKey } from "../../model/colors.model";
import { Observable, startWith, tap } from "rxjs";

@Component({
  selector: "zz-color-config",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    PanelDirective,
    ShadowDirective,
    RoundedDirective,
    InputDirective,
    ToggleCheckComponent,
  ],
  templateUrl: "./color-config.component.html",
})
export class ColorConfigComponent {
  models = colorModels;
  current: ColorModel = namedColorModels["rgb"];

  config = new FormGroup({
    pasos: new FormControl<number>(10, { nonNullable: true }),
    alto: new FormControl<number>(40, { nonNullable: true }),
    continuo: new FormControl<boolean>(false, { nonNullable: true }),
    model: new FormControl<ColorModel>(this.current, { nonNullable: true }),
  });

  @Output() change = this.config.valueChanges;
}
