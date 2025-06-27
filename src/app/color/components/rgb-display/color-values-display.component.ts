import { Component, input } from "@angular/core";
import { ColorModel, Triple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: "zz-color-values-display",
  imports: [DecimalPipe],
  templateUrl: "./color-values-display.component.html",
})
export class ColorValuesDisplayComponent {
  colorModel = input<ColorModel>(namedColorModels.rgb, { alias: "model" });
  values = input(undefined, {
    alias: "values",
    transform: (value?: Triple<number> | undefined) => value ?? ([0, 0, 0] as Triple<number>),
  });

  vertical = input(false, { alias: "vertical" });
}
