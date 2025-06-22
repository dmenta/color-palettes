import { Component, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { ColorModel } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorAxisConfigComponent } from "../color-axis-config/color-axis-config.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { ColorRangeSelectorComponent } from "../color-range-selector/color-range-selector.component";

@Component({
  selector: "zz-color-palette",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorAxisComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisConfigComponent,
  ],
  templateUrl: "./color-palette.component.html",
})
export class ColorPaletteComponent {
  current: ColorModel = namedColorModels["oklch"];

  config = signal({
    alto: 100,
    pasos: 10,
    continuo: false,
  });

  valores = signal({
    Amin: this.current.components.A.defaultValue,
    Amax: this.current.components.A.defaultValue,
    B: this.current.components.B.defaultValue,
    C: this.current.components.C.defaultValue,
  });

  configChanged(config: Partial<{ pasos: number; alto: number; continuo: boolean; model: ColorModel }>) {
    this.config.set({ ...this.config(), ...config });
    this.current = config.model || this.current;
  }

  colorChange(valores: Partial<{ A: number; B: number; C: number }>) {
    this.valores.set({ ...this.valores(), ...valores });
  }
}
