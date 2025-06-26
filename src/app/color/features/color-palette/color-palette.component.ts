import { Component, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorAxisComponent } from "../../components/color-axis/color-axis.component";
import { ColorAxisConfigComponent } from "../../components/color-axis-config/color-axis-config.component";
import { ColorConfigComponent } from "../../components/color-config/color-config.component";
import { ColorRangeSelectorComponent } from "../../components/color-range-selector/color-range-selector.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import { AxisConfig, Tuple, Triple, ColorConfig, ColorComponent } from "../../model/colors.model";
import Color from "colorjs.io";

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
  colorBase = signal<Triple<number>>([0, 0, 0]);

  minmax = signal<Tuple<number>>([0, 0]);

  currentColor = signal<Triple<number>>([0, 0, 0]);

  configChanged(config: AxisConfig) {
    this.axisConfig.set(config);
  }

  colorConfigChanged(config: ColorConfig) {
    this.colorConfig.set(config);
    this.minmax.set(config.variable ? [config.variable.min, config.variable.max] : ([0, 0] as Tuple<number>));
    this.colorBase.set(config.model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
    this.currentColor.set(config.model?.defaultValues() ?? ([0, 0, 0] as Triple<number>));
  }

  colorChange(valores: Triple<number>) {
    this.currentColor.set(valores);
  }

  rangeChange(minmax: Tuple<number>) {
    this.minmax.set(minmax);
  }

  onNewColor(rgb: Triple<number>) {
    const color = this.getChannels(rgb);
    this.colorBase.set(color);
    this.currentColor.set(color);
  }

  private getChannels(rgb: Triple<number>) {
    const model = this.colorConfig()?.model;

    if (model.name === "rgb") {
      return rgb;
    }

    const color = new Color(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`).to(model.name);

    const a = this.ensureCoord(color.coords[0], model.components[0]);
    const b = this.ensureCoord(color.coords[1], model.components[1]);
    const c = this.ensureCoord(color.coords[2], model.components[2]);

    return [a, b, c] as Triple<number>;
  }

  ensureCoord(coord: number, component: ColorComponent): number {
    const coordAsegurada = Number.isNaN(coord) ? 0 : coord;

    return Math.max(0, Math.min(component.max, coordAsegurada));
  }
}
