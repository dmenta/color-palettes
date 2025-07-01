import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
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
  Swatch,
  Palette,
  ColorModelName,
  PaletteInfo,
} from "../model/colors.model";
import { namedColorModels } from "../model/color-models-definitions";
import { toContrast, toHsl, toOklch, toRgb } from "../model/color";
import Color from "colorjs.io";
import { StorageService } from "../../core/service/storage.service";

@Injectable({
  providedIn: "root",
})
export class ColorStateService {
  loadPalette(info: PaletteInfo) {
    this.colorModelChanged(namedColorModels[info.palette.model]);
    this.onVariableConfigChanged(info.state.variableConfig.variable);
    this.paletteStepsConfigChanged(info.state.stepsConfig);
    this.colorBase.set(info.state.currentColor);
    this.currentColor.set(info.state.currentColor);
    this.rangeChanged(info.state.minmax);
  }
  store = inject(StorageService);

  initialState = this.store.get<ColorStateValues>("color-state") ?? defaultColorState;

  readonly showValuesOptions: { text: string; value: showValuesOption }[] = [
    { text: "No", value: "no" },
    { text: "Yes", value: "yes" },
    { text: "RGB", value: "rgb" },
  ];

  readonly colorModel = signal<ColorModel>(namedColorModels[this.initialState.colorModel]);

  readonly variableConfig = signal<VariableConfig>(this.initialState.variableConfig);

  readonly paletteStepsConfig = signal<PaletteStepsConfig>(this.initialState.paletteStepsConfig);
  readonly paletteVisualConfig = signal<PaletteVisualConfig>(this.initialState.paletteVisualConfig);
  readonly paletteValuesConfig = signal<PaletteValuesConfig>(this.initialState.paletteValuesConfig);

  readonly colorBase = signal<Triple<number>>(this.initialState.colorBase);
  readonly currentColor = signal<Triple<number>>(this.initialState.currentColor);

  readonly minmax = signal<Tuple<number>>(this.initialState.minmax);

  readonly rgb = computed(() => toRgb(this.colorModel().convert(this.currentColor())).values);

  readonly currentState = computed(() => {
    return {
      colorModel: this.colorModel().name,
      variableConfig: this.variableConfig(),
      paletteStepsConfig: this.paletteStepsConfig(),
      paletteVisualConfig: this.paletteVisualConfig(),
      paletteValuesConfig: this.paletteValuesConfig(),
      colorBase: this.currentColor(),
      currentColor: this.currentColor(),
      minmax: this.minmax(),
    } as ColorStateValues;
  });

  constructor() {
    effect(() => this.store.save("color-state", this.currentState()));
  }
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

    console.debug("Convirtiendo a", colorModel.name, "con valores", rgb);

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
          nuevo = toRgb(actual!).values;
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

  palette: Signal<Palette> = computed(() => {
    const colorModel = this.colorModel();
    const variableConfig = this.variableConfig();
    const stepsConfig = this.paletteStepsConfig();
    const baseArray = this.currentColor() ?? colorModel.defaultValues();

    const min = this.minmax()[0];
    const max = this.minmax()[1];

    let pasos = stepsConfig?.pasos ?? 10;
    if (stepsConfig?.automatico ?? true) {
      const variable = variableConfig.variable;

      pasos = Math.min(
        pasos,
        Math.max(2, Math.ceil((Math.abs(max - min) / (variable.max - variable.min)) * variable.autoSteps))
      );
    }

    const step = (max - min) / (pasos - 1);

    const valores = Array.from({ length: pasos }, (_, i) => {
      const value = min + i * step;
      const valores = [...baseArray];
      valores[variableConfig.variableIndex] = value;
      const color = colorModel.convert([valores[0]!, valores[1]!, valores[2]!]);
      const rgb = toRgb(color);
      return {
        valores: valores as Triple<number>,
        color: color,
        rgbValues: rgb.values,
        rgb: rgb.color,
        fore: toContrast(color),
      } as Swatch;
    });

    if (valores.length > 0) {
      let previo = valores[0]!.rgbValues;
      for (let i = 1; i < valores.length; i++) {
        const actual = valores[i]!.rgbValues;
        const diff0 = Math.abs(actual[0] - previo[0]);
        const diff1 = Math.abs(actual[1] - previo[1]);
        const diff2 = Math.abs(actual[2] - previo[2]);
        if (diff0 <= 7 && diff1 <= 3 && diff2 <= 14) {
          valores[i - 1]!.clamp = true;
          valores[i]!.clamp = true;
        }
        previo = actual;
      }
    }

    return {
      model: colorModel.name,
      swatches: valores as Swatch[],
    } as Palette;
  });
}

type ColorStateValues = {
  colorModel: ColorModelName;
  variableConfig: VariableConfig;
  paletteStepsConfig: PaletteStepsConfig;
  paletteVisualConfig: PaletteVisualConfig;
  paletteValuesConfig: PaletteValuesConfig;
  colorBase: Triple<number>;
  currentColor: Triple<number>;
  minmax: Tuple<number>;
};

const colorModelDefault = namedColorModels["oklch"];
const defaultColorState: ColorStateValues = {
  colorModel: colorModelDefault.name,
  variableConfig: {
    variable: colorModelDefault.components[colorModelDefault.defaultVariableIndex],
    variableIndex: colorModelDefault.components.findIndex(
      (c) => c.name === colorModelDefault.components[colorModelDefault.defaultVariableIndex].name
    ) as 0 | 1 | 2,
  },
  paletteStepsConfig: {
    pasos: 12,
    automatico: true,
  },
  paletteVisualConfig: {
    alto: 80,
    continuo: false,
    separate: false,
  },
  paletteValuesConfig: {
    showValues: "no",
  },
  colorBase: colorModelDefault.defaultValues(),
  currentColor: colorModelDefault.defaultValues(),
  minmax: [
    colorModelDefault.components[colorModelDefault.defaultVariableIndex].min,
    colorModelDefault.components[colorModelDefault.defaultVariableIndex].max,
  ] as Tuple<number>,
} as ColorStateValues;
