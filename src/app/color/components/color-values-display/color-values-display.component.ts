import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { ColorModelName, ColorValues } from "../../model/colors.model";
import { CopyService } from "../../../core/service/copy.service";
import { namedColorModels } from "../../model/color-models-definitions";
import { toContrast } from "../../model/color";

@Component({
  selector: "zz-color-values-display",
  templateUrl: "./color-values-display.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorValuesDisplayComponent {
  copyService = inject(CopyService);

  colorModelName = input<ColorModelName>("rgb", { alias: "color-model-name" });
  values = input(undefined, {
    alias: "values",
    transform: (value?: ColorValues | undefined) => value ?? ([0, 0, 0] as ColorValues),
  });

  useContrast = input(true, { alias: "use-contrast" });

  vertical = input(false, { alias: "vertical" });

  full = computed(() => namedColorModels[this.colorModelName()].convert(this.values()!));

  parts = computed(() => {
    return namedColorModels[this.colorModelName()].displayValues(this.values() ?? [0, 0, 0]);
  });

  contrast = computed(() => toContrast(this.full()));

  copy() {
    this.copyService.copy(this.full(), "Color copied!");
  }
}
