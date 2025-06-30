import { computed, Injectable, signal } from "@angular/core";
import {
  ColorComponent,
  VariableConfig,
  ColorModel,
  PaletteStepsConfig,
  PaletteValuesConfig,
  PaletteVisualConfig,
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

  readonly colorModel = signal<ColorModel>(this.defaultModel);

  readonly variableConfig = signal<VariableConfig>({
    variable: this.defaultModel.components[this.defaultModel.defaultVariableIndex],
    variableIndex: this.defaultModel.components.findIndex(
      (c) => c.name === this.defaultModel.components[this.defaultModel.defaultVariableIndex].name
    ) as 0 | 1 | 2,
  });

  readonly paletteStepsConfig = signal<PaletteStepsConfig>({
    pasos: 12,
    automatico: true,
  });
  readonly paletteVisualConfig = signal<PaletteVisualConfig>({
    alto: 80,
    continuo: false,
    separate: false,
  });
  readonly paletteValuesConfig = signal<PaletteValuesConfig>({
    showValues: this.showValuesOptions![0]?.value ?? "no",
  });

  readonly colorBase = signal<Triple<number>>(this.defaultModel.defaultValues());
  readonly currentColor = signal<Triple<number>>(this.defaultModel.defaultValues());

  readonly minmax = signal<Tuple<number>>([
    this.defaultModel.components[this.defaultModel.defaultVariableIndex].min,
    this.defaultModel.components[this.defaultModel.defaultVariableIndex].max,
  ]);

  readonly rgb = computed(() => toRgb(this.colorModel().convert(this.currentColor())));

  colorModelChanged(colorModel: ColorModel) {
    this.onColorModelChanged(colorModel);
  }

  variableChanged(variable: ColorComponent) {
    this.onVariableConfigChanged(variable);
  }

  paletteStepsConfigChanged(config: PaletteStepsConfig) {
    this.paletteStepsConfig.set(config);
  }

  paletteVisualConfigChanged(config: PaletteVisualConfig) {
    this.paletteVisualConfig.set(config);
  }

  paletteValuesConfigChanged(config: PaletteValuesConfig) {
    this.paletteValuesConfig.set(config);
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
    this.colorChanged(color);
  }

  private getChannels(rgb: Triple<number>) {
    const colorModel = this.colorModel();

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

  private onColorModelChanged(colorModel: ColorModel) {
    const actual = this.colorModel().convert(this.currentColor());
    let nuevo: Triple<number> = colorModel.defaultValues() ?? ([0, 0, 0] as Triple<number>);

    if (actual) {
      switch (colorModel.name) {
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

    this.colorModel.set(colorModel);
    this.onVariableConfigChanged(colorModel.components[colorModel.defaultVariableIndex]);

    this.colorBase.set(nuevo);
    this.currentColor.set(nuevo);
  }

  private onVariableConfigChanged(variable: ColorComponent) {
    const indice = this.colorModel().components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2;

    this.variableConfig.set({
      variable: variable,
      variableIndex: indice,
    });
    this.minmax.set(variable ? [variable.min, variable.max] : ([0, 0] as Tuple<number>));
  }
}
