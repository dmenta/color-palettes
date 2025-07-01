import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { ColorSwatchDirective } from "../../directives/color-swatch.directive";
import { Palette } from "../../model/palette.model";
import { namedColorModels } from "../../model/color-models-definitions";

@Component({
  selector: "zz-mini-palette",
  imports: [ColorSwatchDirective],
  templateUrl: "./mini-palette.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniPaletteComponent {
  palette = input<Palette | undefined>(undefined);

  colorModel = computed(() => {
    const modelName = this.palette()?.model;
    if (!modelName) {
      return undefined;
    }
    return namedColorModels[modelName];
  });
}
