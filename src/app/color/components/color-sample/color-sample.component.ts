import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { ColorSelectorComponent } from "./color-selector/color-selector.component";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-color-sample",
  imports: [ReactiveFormsModule, ColorSwatchDirective, ColorValuesDisplayComponent, ColorSelectorComponent],
  templateUrl: "./color-sample.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSampleComponent {
  height = input(120);

  state = inject(ColorStateService);
}
