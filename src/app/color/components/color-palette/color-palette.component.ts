import { Component, computed, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { ColorModel, Triple, Tuple } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorAxisConfigComponent } from "../color-axis-config/color-axis-config.component";
import { ColorAxisComponent } from "../color-axis/color-axis.component";
import { ColorRangeSelectorComponent } from "../color-range-selector/color-range-selector.component";

@Component({
  selector: "zz-color-palette",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorAxisComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisConfigComponent,
  ],
  templateUrl: "./color-palette.component.html",
})
export class ColorPaletteComponent {
  current: ColorModel = namedColorModels["oklch"];

  config = signal({
    alto: 25,
    pasos: 10,
    continuo: false,
    variable: 0 as 0 | 1 | 2,
  });

  fixedIndexs = computed(() => {
    const variable = this.config().variable;
    if (variable === 0) {
      return [1, 2];
    } else if (variable === 1) {
      return [0, 2];
    }
    return [0, 1];
  });

  currentColor = computed(() => {
    const variable = this.config().variable;
    const fixedIndexs = this.fixedIndexs();
    const valores = this.valores();

    const valoresResolved = [0, 0, 0];
    valoresResolved[fixedIndexs[0]] = valores.fixedValues[0];
    valoresResolved[fixedIndexs[1]] = valores.fixedValues[1];
    valoresResolved[variable] = this.current.components[variable].average(valores.min, valores.max);

    return valoresResolved as Triple<number>;
  });

  valores = signal({
    min: this.current.components[0].defaultValue,
    max: this.current.components[0].defaultValue,
    fixedValues: [this.current.components[1].defaultValue, this.current.components[2].defaultValue] as Tuple<number>,
  });

  configChanged(config: Partial<{ pasos: number; alto: number; continuo: boolean; model: ColorModel }>) {
    this.config.set({ ...this.config(), ...config });
    this.current = config.model || this.current;
  }

  colorChange(valores: Partial<{ min: number; max: number; f0: number; f1: number }>) {
    const fixedValues = this.valores().fixedValues;
    if (valores.f0 !== undefined) {
      fixedValues[0] = valores.f0;
    }
    if (valores.f1 !== undefined) {
      fixedValues[1] = valores.f1;
    }
    this.valores.set({ min: valores.min, max: valores.max, fixedValues: [valores.f0, valores.f1] });
  }
}
