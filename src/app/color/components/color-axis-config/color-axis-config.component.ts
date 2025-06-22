import { Component, Output } from "@angular/core";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputDirective } from "../../../core/components/select/select.directive";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { RoundedDirective } from "../../../core/directives/rounded.directive";

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
  config = new FormGroup({
    pasos: new FormControl<number>(10, { nonNullable: true }),
    alto: new FormControl<number>(100, { nonNullable: true }),
    continuo: new FormControl<boolean>(false, { nonNullable: true }),
  });

  @Output() change = this.config.valueChanges;
}
