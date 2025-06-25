import { Component, computed, Signal, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorAxisComponent } from "../../components/color-axis/color-axis.component";
import { ColorAxisConfigComponent } from "../../components/color-axis-config/color-axis-config.component";
import { ColorConfigComponent } from "../../components/color-config/color-config.component";
import { ColorRangeSelectorComponent } from "../../components/color-range-selector/color-range-selector.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import { AxisConfig, ColorModel, ColorComponent, Tuple, Triple, ColorConfig } from "../../model/colors.model";

@Component({
  selector: "zz-color-palette",
  imports: [
    ReactiveFormsModule,
    ColorAxisComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-palette.component.html",
})
export class ColorPaletteComponent {
  colorConfig = signal<ColorConfig | undefined>(undefined);
  axisConfig = signal<AxisConfig | undefined>(undefined);

  minmax = signal<Tuple<number>>([0, 0]);
  currentColor = signal<Triple<number>>([0, 0, 0]);
  pasos: Signal<number | undefined> = undefined;

  configChanged(config: AxisConfig) {
    this.axisConfig.set(config);
  }
  colorConfigChanged(config: ColorConfig) {
    this.colorConfig.set(config);
    this.minmax.set(config.variable ? [config.variable.min, config.variable.max] : ([0, 0] as Tuple<number>));
    this.currentColor.set(config.model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
  }
  colorChange(valores: Triple<number>) {
    this.currentColor.set(valores);
  }

  rangeChange(minmax: Tuple<number>) {
    this.minmax.set(minmax);
  }
}
