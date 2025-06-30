import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ColorSwatchPanelDirective } from "../../directives/color-swatch.directive";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-color-palette",
  imports: [ColorSwatchPanelDirective, ColorValuesDisplayComponent],
  templateUrl: "./color-palette.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent {
  state = inject(ColorStateService);
}
