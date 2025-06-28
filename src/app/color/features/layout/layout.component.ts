import { Component, signal } from "@angular/core";
import { LayoutHeaderComponent } from "./layout-header/layout-header.component";
import { ColorMenuComponent } from "../../components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import Color from "colorjs.io";
import { AxisConfig, ColorComponent, ColorConfig, Triple, Tuple } from "../../model/colors.model";
import { toHsl, toOklch, toRgb } from "../../model/color";
import { ColorRangeSelectorComponent } from "../../components/color-range-selector/color-range-selector.component";
import { ColorAxisComponent } from "../../components/color-axis/color-axis.component";
import { ColorAxisAdvancedConfigComponent } from "../../components/axis-advanced-config/axis-advanced-config.component";

@Component({
  selector: "zz-layout",
  imports: [
    LayoutHeaderComponent,
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisComponent,
    ColorAxisAdvancedConfigComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  colorConfig = signal<ColorConfig | undefined>(undefined);
  axisConfig = signal<AxisConfig | undefined>(undefined);
  colorBase = signal<Triple<number>>([0, 0, 0]);

  minmax = signal<Tuple<number>>([0, 0]);

  currentColor = signal<Triple<number>>([0, 0, 0]);

  configChanged(config: AxisConfig) {
    this.axisConfig.set(config);
  }

  colorConfigChanged(config: ColorConfig) {
    const actual = this.colorConfig()?.model.convert(this.currentColor());
    let nuevo: Triple<number> = config.model?.defaultValues() ?? ([0, 0, 0] as Triple<number>);

    if (config.model.name === this.colorConfig()?.model.name) {
      nuevo = this.currentColor();
    }

    if (actual) {
      switch (config.model.name) {
        case "hsl":
          nuevo = toHsl(actual!);
          break;
        case "oklch":
          nuevo = toOklch(actual!);
          break;
        default:
          nuevo = toRgb(actual!);
      }
    }

    this.colorConfig.set(config);
    this.minmax.set(config.variable ? [config.variable.min, config.variable.max] : ([0, 0] as Tuple<number>));
    this.colorBase.set(nuevo);
    this.currentColor.set(nuevo);
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
    const colorModel = this.colorConfig()?.model;

    if (!colorModel || colorModel.name === "rgb") {
      return rgb;
    }

    const color = new Color(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`).to(colorModel.name);

    const a = this.ensureCoord(color.coords[0], colorModel.components[0]);
    const b = this.ensureCoord(color.coords[1], colorModel.components[1]);
    const c = this.ensureCoord(color.coords[2], colorModel.components[2]);

    return [a, b, c] as Triple<number>;
  }

  ensureCoord(coord: number, component: ColorComponent): number {
    const coordAsegurada = Number.isNaN(coord) ? 0 : coord;

    return Math.max(0, Math.min(component.max, coordAsegurada));
  }
}
