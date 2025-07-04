import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import {
  ColorComponent,
  VariableConfig,
  ColorModel,
  ColorValues,
  ColorConfig,
  Range,
  ColorValueKey,
  rangeTotal,
} from "../model/colors.model";
import { namedColorModels } from "../model/color-models-definitions";
import { colorClamping, rgbTo, toHsl, toOklch, toRgb } from "../model/color";
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
import { ColorStateValues, defaultColorState } from "../model/default-values";

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
    { text: "HEX", value: "hex" },
  ];

  private readonly colorModel = signal<ColorModel>(namedColorModels[this.initialState.colorConfig.colorModelName]);

  private readonly variableConfig = signal<VariableConfig>({
    variable: this.colorModel().components[this.initialState.colorConfig.variableIndex],
    variableIndex: this.initialState.colorConfig.variableIndex,
  });

  private readonly range = signal<Range>(this.initialState.colorConfig.range as Range);

  get showValuesOptions() {
    return this._showValuesOptions;
  }

  readonly currentColor = signal<ColorValues>(this.initialState.colorConfig.color);

  readonly colorConfig = signal<ColorConfig>({
    colorModel: this.colorModel(),
    ...this.variableConfig(),
    color: this.currentColor(),
    range: this.range(),
  });

  readonly paletteStepsConfig = signal<PaletteStepsConfig>(this.initialState.paletteStepsConfig);
  readonly paletteVisualConfig = signal<PaletteVisualConfig>(this.initialState.paletteVisualConfig);
  readonly paletteValuesConfig = signal<PaletteValuesConfig>(this.initialState.paletteValuesConfig);

  readonly rgb = computed(() => toRgb(this.colorModel().convert(this.currentColor())).values);

  private readonly currentState = computed(() => {
    return {
      colorConfig: {
        colorModelName: this.colorModel().name,
        variable: this.colorConfig().variable,
        variableIndex: this.colorConfig().variableIndex,
        color: this.currentColor(),
        range: this.range(),
      },
      paletteStepsConfig: this.paletteStepsConfig(),
      paletteVisualConfig: this.paletteVisualConfig(),
      paletteValuesConfig: this.paletteValuesConfig(),
    } as ColorStateValues;
  });

  palette: Signal<Palette> = computed(() => {
    const config = { ...this.colorConfig(), color: this.currentColor(), range: this.range() } as ColorConfig;
    const stepsConfig = this.paletteStepsConfig();
    const baseArray = this.currentColor() ?? config.colorModel.defaultValues();

    const min = config.range.min;
    const max = config.range.max;

    let steps = stepsConfig?.steps ?? 10;
    if (stepsConfig?.automatic ?? true) {
      const variable = config.variable;

      steps = Math.min(
        steps,
        Math.max(2, Math.ceil((Math.abs(max - min) / rangeTotal(variable.range)) * variable.autoSteps))
      );
    }

    const step = (max - min) / (steps - 1);

    const valores = Array.from({ length: steps }, (_, i) => {
      const value = min + i * step;
      const valores = { ...baseArray };
      valores[config.variableIndex] = value;
      const color = config.colorModel.convert([valores[0]!, valores[1]!, valores[2]!]);
      const rgb = toRgb(color);
      return {
        valores: valores as ColorValues,
        color: color,
        rgbValues: rgb.values,
        rgb: rgb.color,
      } as Swatch;
    });

    if (valores.length > 0) {
      let previo = valores[0]!.rgbValues;
      for (let i = 1; i < valores.length; i++) {
        const actual = valores[i]!.rgbValues;

        if (colorClamping(actual, previo)) {
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
    const varConfig = {
      variable: namedColorModels[info.palette.model].components[info.state.colorConfig.variableIndex],
      variableIndex: info.state.colorConfig.variableIndex,
    } as VariableConfig;
    this.paletteStepsConfigChanged(info.state.stepsConfig);
    this.colorModel.set(namedColorModels[info.palette.model]);
    this.variableConfig.set(varConfig);
    this.currentColor.set(info.state.colorConfig.color);
    this.range.set(info.state.colorConfig.range as Range);
    this.colorConfig.set({
      colorModel: this.colorModel(),
      variable: this.variableConfig().variable,
      variableIndex: this.variableConfig().variableIndex,
      color: this.currentColor(),
      range: this.range(),
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
      range: this.range(),
    });
  }

  variableChanged(variable: ColorComponent) {
    this.onVariableConfigChanged(variable, this.currentColor());

    this.colorConfig.update((curr) => ({
      ...curr,
      variable: this.variableConfig().variable,
      variableIndex: this.variableConfig().variableIndex,
      color: this.currentColor(),
      range: this.range(),
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

  rangeChanged(range: Range) {
    this.range.set(range);
  }

  colorChanged(valores: ColorValues) {
    this.currentColor.set(valores);
  }

  colorSelected(rgb: ColorValues) {
    const color = rgbTo(rgb, this.colorModel());

    this.colorConfig.update((curr) => ({
      ...curr,
      color: color,
      range: curr.variable.bestRange(color[curr.variableIndex]!),
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
          range: this.range(),
        },
        stepsConfig: this.paletteStepsConfig(),
      },
    } as PaletteInfo;
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
    const indice = this.colorModel().components.findIndex((c) => c.name === variable.name) as ColorValueKey;

    this.variableConfig.set({
      variable: variable,
      variableIndex: indice,
    });

    this.range.set(variable.bestRange(currentColor[indice]!));
  }
}
