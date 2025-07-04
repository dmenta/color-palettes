import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModel, ColorValues } from "../model/colors.model";

@Directive({
  selector: "[color-swatch]",
})
export class ColorSwatchDirective {
  colorModel = input<ColorModel | undefined>(undefined, { alias: "color-model" });
  values = input<ColorValues | undefined>(undefined);

  @HostBinding("style.backgroundColor")
  get background() {
    return this.bgColor() ?? "black";
  }
  bgColor = computed(() => {
    const colorModel = this.colorModel();
    if (!colorModel) {
      return undefined;
    }

    const valores = this.values() ?? [0, 0, 0];
    return colorModel.convert([valores[0], valores[1], valores[2]]);
  });
}

@Directive({
  selector: "[color-swatch-panel]",
  hostDirectives: [{ directive: ColorSwatchDirective, inputs: ["color-model", "values"] }],
})
export class ColorSwatchPanelDirective {}
