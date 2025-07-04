import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { ColorStateService } from "../../services/color-state.service";
import { Palette } from "../../model/palette.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { NgClass } from "@angular/common";

@Component({
  selector: "zz-color-palette",
  imports: [ColorSwatchDirective, ColorValuesDisplayComponent, NgClass],
  templateUrl: "./color-palette.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPaletteComponent {
  state = inject(ColorStateService);

  palette = input<Palette | undefined>(undefined);

  colorModel = computed(() => {
    const modelName = this.palette()?.model;
    if (!modelName) {
      return undefined;
    }
    return namedColorModels[modelName];
  });
}
