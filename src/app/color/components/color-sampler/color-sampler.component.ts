import { Component, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { ColorModel } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorSelectorComponent } from "../color-selector/color-selector.component";
import { ColorConfigComponent } from "../color-config/color-config.component";

@Component({
  selector: "zz-color-sampler",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorSampleComponent,
    ColorSelectorComponent,
    ColorConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-sampler.component.html",
})
export class ColorSamplerComponent {
  current: ColorModel = namedColorModels["rgb"];

  config = signal({
    alto: 40,
    pasos: 10,
    continuo: false,
  });

  valores = signal({
    A: this.current.components.A.defaultValue,
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
