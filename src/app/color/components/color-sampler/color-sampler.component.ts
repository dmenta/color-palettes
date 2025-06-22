import { Component, computed, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { namedColorModels } from "../../model/color-models-definitions";
import { ColorModel } from "../../model/colors.model";
import { ColorSampleComponent } from "../color-sample/color-sample.component";
import { ColorSelectorComponent } from "../color-selector/color-selector.component";
import { ColorConfigComponent } from "../color-config/color-config.component";

@Component({
  selector: "zz-color-sampler",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ColorSampleComponent,
    ColorSelectorComponent,
    ColorConfigComponent,
    ColorConfigComponent,
  ],
  templateUrl: "./color-sampler.component.html",
})
export class ColorSamplerComponent {
  current: ColorModel = namedColorModels["rgb"];

  config = signal({
    alto: 40,
    pasos: 10,
    continuo: false,
  });

  valores = signal({
    v0: this.current.components[0].defaultValue,
    v1: this.current.components[1].defaultValue,
    v2: this.current.components[2].defaultValue,
  });

  currentColor = computed(() => {
    const valores = this.valores();
    return [valores.v0, valores.v1, valores.v2] as [number, number, number];
  });

  configChanged(config: Partial<{ pasos: number; alto: number; continuo: boolean; model: ColorModel }>) {
    this.config.set({ ...this.config(), ...config });
    this.current = config.model || this.current;
  }

  colorChange(valores: Partial<{ v0: number; v1: number; v2: number }>) {
    this.valores.set({
      v0: valores.v0 ?? this.valores().v0,
      v1: valores.v1 ?? this.valores().v1,
      v2: valores.v2 ?? this.valores().v2,
    });
  }
}
