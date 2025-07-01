import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { ColorModel, Triple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { DecimalPipe } from "@angular/common";
import { CopyService } from "../../services/copy.service";

@Component({
  selector: "zz-color-values-display",
  imports: [DecimalPipe],
  templateUrl: "./color-values-display.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorValuesDisplayComponent {
  copyService = inject(CopyService);

  colorModel = input<ColorModel>(namedColorModels.rgb, { alias: "color-model" });
  values = input(undefined, {
    alias: "values",
    transform: (value?: Triple<number> | undefined) => value ?? ([0, 0, 0] as Triple<number>),
  });

  vertical = input(false, { alias: "vertical" });

  copy() {
    this.copyService.copy(this.colorModel().convert(this.values()!), "Color copied!");
  }
}
