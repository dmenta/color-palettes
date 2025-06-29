import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModel, Triple } from "../model/colors.model";
import { RoundedDirective } from "../../core/directives/rounded.directive";
import { ShadowDirective } from "../../core/directives/shadow.directive";

@Directive({
  selector: "[color-swatch]",
})
export class ColorSwatchDirective {
  colorModel = input<ColorModel | undefined>(undefined, { alias: "color-model" });
  values = input<Triple<number> | undefined>(undefined);

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
  hostDirectives: [
    { directive: ColorSwatchDirective, inputs: ["color-model", "values"] },
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
    { directive: ShadowDirective, inputs: ["zz-shadow:shadow"] },
  ],
})
export class ColorSwatchPanelDirective {}
