import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import {
  ColorComponent,
  VariableConfig,
  ColorModel,
  ColorValues,
  ColorConfig,
  ColorConfigState,
  MinMax,
} from "../model/colors.model";
import { namedColorModels } from "../model/color-models-definitions";
import { toContrast, toHsl, toOklch, toRgb } from "../model/color";
import Color from "colorjs.io";
import { StorageService } from "../../core/service/storage.service";
import {
  Palette,
  PaletteInfo,
  PaletteStepsConfig,
  PaletteValuesConfig,
  PaletteVisualConfig,
  showValuesOption,
  Swatch,
} from "../model/palette.model";

@Injectable({
  providedIn: "root",
})
export class ColorStateService {
  private store = inject(StorageService);

  private initialState = this.store.get<ColorStateValues>("color-state") ?? defaultColorState;

  private readonly _showValuesOptions: { text: string; value: showValuesOption }[] = [
    { text: "No", value: "no" },
    { text: "Yes", value: "yes" },
    { text: "RGB", value: "rgb" },
  ];

  private readonly colorModel = signal<ColorModel>(namedColorModels[this.initialState.colorConfig.colorModelName]);

  private readonly variableConfig = signal<VariableConfig>({
    variable: this.initialState.colorConfig.variable,
    variableIndex: this.initialState.colorConfig.variableIndex as 0 | 1 | 2,
  });

  get showValuesOptions() {
    return this._showValuesOptions;
  }

  readonly currentColor = signal<ColorValues>(this.initialState.colorConfig.color);

  readonly minmax = signal<MinMax>(this.initialState.colorConfig.minmax as MinMax);

  readonly colorConfig = signal<ColorConfig>({
    colorModel: this.colorModel(),
    ...this.variableConfig(),
    color: this.currentColor(),
    minmax: this.minmax(),
  });

  readonly paletteStepsConfig = signal<PaletteStepsConfig>(this.initialState.paletteStepsConfig);
  readonly paletteVisualConfig = signal<PaletteVisualConfig>(this.initialState.paletteVisualConfig);
  readonly paletteValuesConfig = signal<PaletteValuesConfig>(this.initialState.paletteValuesConfig);

  readonly rgb = computed(() => toRgb(this.colorModel().convert(this.currentColor())).values);

  readonly currentState = computed(() => {
    return {
      colorConfig: {
        colorModelName: this.colorModel().name,
        variable: this.variableConfig().variable,
        variableIndex: this.variableConfig().variableIndex,
        color: this.currentColor(),
        minmax: this.minmax(),
      },
      paletteStepsConfig: this.paletteStepsConfig(),
      paletteVisualConfig: this.paletteVisualConfig(),
      paletteValuesConfig: this.paletteValuesConfig(),
    } as ColorStateValues;
  });

  palette: Signal<Palette> = computed(() => {
    const config = { ...this.colorConfig(), color: this.currentColor(), minmax: this.minmax() } as ColorConfig;
    const stepsConfig = this.paletteStepsConfig();
    const baseArray = this.currentColor() ?? config.colorModel.defaultValues();

    const min = config.minmax[0];
    const max = config.minmax[1];

    let pasos = stepsConfig?.pasos ?? 10;
    if (stepsConfig?.automatico ?? true) {
      const variable = config.variable;

      pasos = Math.min(
        pasos,
        Math.max(2, Math.ceil((Math.abs(max - min) / (variable.max - variable.min)) * variable.autoSteps))
      );
    }

    const step = (max - min) / (pasos - 1);

    const valores = Array.from({ length: pasos }, (_, i) => {
      const value = min + i * step;
      const valores = [...baseArray];
      valores[config.variableIndex] = value;
      const color = config.colorModel.convert([valores[0]!, valores[1]!, valores[2]!]);
      const rgb = toRgb(color);
      return {
        valores: valores as ColorValues,
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
      model: config.colorModel.name,
      swatches: valores as Swatch[],
    } as Palette;
  });

  constructor() {
    effect(() => this.store.save("color-state", this.currentState()));
  }

  loadPalette(info: PaletteInfo) {
    this.paletteStepsConfigChanged(info.state.stepsConfig);
    this.colorModel.set(namedColorModels[info.palette.model]);
    this.variableConfig.set(info.state.colorConfig);
    this.currentColor.set(info.state.colorConfig.color);
    this.minmax.set(info.state.colorConfig.minmax as MinMax);
    this.colorConfig.set({
      colorModel: this.colorModel(),
      variable: this.variableConfig().variable,
      variableIndex: this.variableConfig().variableIndex,
      color: this.currentColor(),
      minmax: this.minmax(),
    });
  }

  showValuesOption(value: showValuesOption): { text: string; value: showValuesOption } {
    return this._showValuesOptions.find((option) => option.value === value)!;
  }
  colorModelChanged(colorModel: ColorModel) {
    this.onColorModelChanged(colorModel);

    this.colorConfig.set({
      colorModel: colorModel,
      variable: this.variableConfig().variable,
      variableIndex: this.variableConfig().variableIndex,
      color: this.currentColor(),
      minmax: this.minmax(),
    });
  }

  variableChanged(variable: ColorComponent) {
    this.onVariableConfigChanged(variable, this.currentColor());

    this.colorConfig.update((curr) => ({
      ...curr,
      variable: this.variableConfig().variable,
      variableIndex: this.variableConfig().variableIndex,
      color: this.currentColor(),
      minmax: this.minmax(),
    }));
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

  rangeChanged(minmax: MinMax) {
    this.minmax.set(minmax);
  }

  colorChanged(valores: ColorValues) {
    this.currentColor.set(valores);
  }

  colorSelected(rgb: ColorValues) {
    const color = this.getChannels(rgb);

    this.colorConfig.update((curr) => ({
      ...curr,
      color: color,
      minmax: this.calcMinMax(color),
    }));
  }

  currentPaletteInfo(): PaletteInfo {
    return {
      palette: this.palette(),
      state: {
        colorConfig: {
          colorModelName: this.colorModel().name,
          variable: this.variableConfig().variable,
          variableIndex: this.variableConfig().variableIndex,
          color: this.currentColor(),
          minmax: this.minmax(),
        },
        stepsConfig: this.paletteStepsConfig(),
      },
    } as PaletteInfo;
  }

  private getChannels(rgb: ColorValues) {
    const colorModel = this.colorModel();

    if (!colorModel || colorModel.name === "rgb") {
      return rgb;
    }

    const color = new Color(`rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`).to(colorModel.name);

    const a = this.ensureCoord(color.coords[0], colorModel.components[0]);
    const b = this.ensureCoord(color.coords[1], colorModel.components[1]);
    const c = this.ensureCoord(color.coords[2], colorModel.components[2]);

    return [a, b, c] as ColorValues;
  }

  private ensureCoord(coord: number, component: ColorComponent): number {
    const coordAsegurada = Number.isNaN(coord) ? 0 : coord;

    return Math.max(0, Math.min(component.max, coordAsegurada));
  }

  private onColorModelChanged(colorModel: ColorModel) {
    const actual = this.colorModel().convert(this.currentColor());
    let nuevo: ColorValues = colorModel.defaultValues() ?? ([0, 0, 0] as ColorValues);
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
    this.onVariableConfigChanged(colorModel.components[colorModel.defaultVariableIndex], nuevo);
    this.currentColor.set(nuevo);
  }

  private onVariableConfigChanged(variable: ColorComponent, currentColor: ColorValues) {
    const indice = this.colorModel().components.findIndex((c) => c.name === variable.name) as 0 | 1 | 2;

    this.variableConfig.set({
      variable: variable,
      variableIndex: indice,
    });
    this.minmax.set(this.calcMinMax(currentColor));
  }

  private calcMinMax(currentColor: ColorValues) {
    const config = this.variableConfig();
    const value = currentColor[config.variableIndex];

    const middle = (config.variable.max + config.variable.min) / 2;
    const max = value > middle ? config.variable.max : value * 2 - config.variable.min;
    const min = value < middle ? config.variable.min : value * 2 - config.variable.max;

    return [min, max] as MinMax;
  }
}

type ColorStateValues = {
  colorConfig: ColorConfigState;
  paletteStepsConfig: PaletteStepsConfig;
  paletteVisualConfig: PaletteVisualConfig;
  paletteValuesConfig: PaletteValuesConfig;
};

const colorModelDefault = namedColorModels["oklch"];
const defaultColorState: ColorStateValues = {
  colorConfig: {
    colorModelName: colorModelDefault.name,
    variable: colorModelDefault.components[colorModelDefault.defaultVariableIndex],
    variableIndex: colorModelDefault.components.findIndex(
      (c) => c.name === colorModelDefault.components[colorModelDefault.defaultVariableIndex].name
    ) as 0 | 1 | 2,
    color: colorModelDefault.defaultValues() as ColorValues,
    minmax: [
      colorModelDefault.components[colorModelDefault.defaultVariableIndex].min,
      colorModelDefault.components[colorModelDefault.defaultVariableIndex].max,
    ] as MinMax,
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
} as ColorStateValues;
