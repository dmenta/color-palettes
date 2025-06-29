import { Component, inject, input } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { ColorSelectorComponent } from "../selector/color-selector.component";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";
import { ColorStateService } from "../../services/color-statae.service";

@Component({
  selector: "zz-color-sample",
  imports: [
    ReactiveFormsModule,
    FullWidthColorSwatchDirective,
    RoundedDirective,
    ShadowDirective,
    ColorValuesDisplayComponent,
    ColorSelectorComponent,
    PanelDirective,
  ],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);

  state = inject(ColorStateService);
}
