import { computed, Injectable, signal } from "@angular/core";
import {
  AxisConfig,
  ColorComponent,
  ColorConfig,
  ColorModel,
  showValuesOption,
  Triple,
  Tuple,
} from "../model/colors.model";
import { namedColorModels } from "../model/color-models-definitions";
import { toHsl, toOklch, toRgb } from "../model/color";
import Color from "colorjs.io";

@Injectable({
  providedIn: "root",
})
export class ColorStateService {
  readonly defaultModel = namedColorModels["oklch"];

  readonly showValuesOptions: { text: string; value: showValuesOption }[] = [
    { text: "No", value: "no" },
    { text: "Yes", value: "yes" },
    { text: "RGB", value: "rgb" },
  ];

  readonly colorConfig = signal<ColorConfig>({
    model: this.defaultModel,
    variable: this.defaultModel.components[this.defaultModel.defaultVariableIndex],
    variableIndex: this.defaultModel.components.findIndex(
      (c) => c.name === this.defaultModel.components[this.defaultModel.defaultVariableIndex].name
    ) as 0 | 1 | 2,
  });

  readonly axisConfig = signal<AxisConfig>({
    alto: 100,
    continuo: false,
    pasos: 12,
    automatico: true,
    showValues: this.showValuesOptions![0]?.value ?? "no",
    separate: false,
  });

  readonly colorBase = signal<Triple<number>>(this.defaultModel.defaultValues());

  readonly minmax = signal<Tuple<number>>([
    this.defaultModel.components[this.defaultModel.defaultVariableIndex].min,
    this.defaultModel.components[this.defaultModel.defaultVariableIndex].max,
  ]);

  readonly currentColor = signal<Triple<number>>(this.defaultModel.defaultValues());

  readonly rgb = computed(() => toRgb(this.colorConfig().model.convert(this.currentColor())));

  modelChanged(model: ColorModel) {
    this.colorConfigChanged({
      model: model,
      variable: model.components[model.defaultVariableIndex],
      variableIndex: model.components.findIndex((c) => c.name === model.components[model.defaultVariableIndex].name) as
        | 0
        | 1
        | 2,
    });
  }

  variableChanged(variable: ColorComponent) {
    const model = this.colorConfig().model;
    this.colorConfigChanged({
      model: model,
      variable: variable,
      variableIndex: model.components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2,
    });
  }

  axisConfigChanged(config: AxisConfig) {
    this.axisConfig.set(config);
  }

  rangeChanged(minmax: Tuple<number>) {
    this.minmax.set(minmax);
  }

  colorChanged(valores: Triple<number>) {
    this.currentColor.set(valores);
  }

  colorSelected(rgb: Triple<number>) {
    const color = this.getChannels(rgb);
    this.colorBase.set(color);
    this.currentColor.set(color);
  }

  private colorConfigChanged(colorConfig: ColorConfig) {
    this.onColorConfigChanged(colorConfig);
    this.colorConfig.set(colorConfig);
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

  private ensureCoord(coord: number, component: ColorComponent): number {
    const coordAsegurada = Number.isNaN(coord) ? 0 : coord;

    return Math.max(0, Math.min(component.max, coordAsegurada));
  }
  private onColorConfigChanged(config: ColorConfig) {
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
}
