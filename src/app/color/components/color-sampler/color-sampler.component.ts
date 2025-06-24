import { Component, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ColorModel, Triple } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorSelectorComponent } from "../color-selector/color-selector.component";
import { ColorConfigComponent } from "../color-config/color-config.component";
import { ColorAxisConfigComponent } from "../color-axis-config/color-axis-config.component";

@Component({
  selector: "zz-color-sampler",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorSampleComponent,
    ColorSelectorComponent,
    ColorAxisConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-sampler.component.html",
})
export class ColorSamplerComponent {
  config = signal<
    | {
        alto: number;
        pasos: number;
        continuo: boolean;
      }
    | undefined
  >(undefined);

  colorConfig = signal<
    | {
        model: ColorModel;
      }
    | undefined
  >(undefined);

  currentColor = signal<Triple<number>>([0, 0, 0]);

  axisConfigChanged(config: { pasos: number; alto: number; continuo: boolean }) {
    this.config.set(config);
  }
  colorConfigChanged(config: { model: ColorModel }) {
    this.colorConfig.set(config);
  }

  colorChange(valores: Partial<{ v0: number; v1: number; v2: number }>) {
    this.currentColor.set([valores.v0, valores.v1, valores.v2]);
  }
}
