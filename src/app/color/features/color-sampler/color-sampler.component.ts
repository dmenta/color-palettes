import { Component, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorAxisConfigComponent } from "../../components/color-axis-config/color-axis-config.component";
import { ColorConfigComponent } from "../../components/color-config/color-config.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import { ColorSelectorComponent } from "../../components/color-selector/color-selector.component";
import { AxisConfig, ColorModel, Triple } from "../../model/colors.model";

@Component({
  selector: "zz-color-sampler",
  imports: [
    ReactiveFormsModule,
    ColorSampleComponent,
    ColorSelectorComponent,
    ColorAxisConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-sampler.component.html",
})
export class ColorSamplerComponent {
  axisConfig = signal<AxisConfig | undefined>(undefined);

  colorConfig = signal<
    | {
        model: ColorModel;
      }
    | undefined
  >(undefined);

  currentColor = signal<Triple<number>>([0, 0, 0]);

  axisConfigChanged(config: AxisConfig) {
    this.axisConfig.set(config);
  }
  colorConfigChanged(config: { model: ColorModel }) {
    this.colorConfig.set(config);
  }

  colorChange(valores: Triple<number>) {
    this.currentColor.set(valores);
  }
}
