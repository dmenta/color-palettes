import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModelName, Triple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";

@Directive({
  selector: "[color-swatch]",
  hostDirectives: [
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
    { directive: ShadowDirective, inputs: ["zz-shadow:shadow"] },
  ],
})
export class ColorSwatchDirective {
  width = input<number | "full">("full");
  height = input(50);
  model = input<ColorModelName>("rgb");
  values = input([50, 1, 200], {
    transform: (values?: Triple<number>) => [...(values?.map((v, i) => this.clampValue(i, v)) ?? [0, 0, 0])],
  });

  @HostBinding("style.backgroundColor")
  get background() {
    return this.bgColor();
  }
  @HostBinding("style.width")
  get widthResolved() {
    const width = this.width();
    return width === "full" ? "100%" : `${width}px`;
  }
  @HostBinding("style.height.px")
  get heightResolved() {
    return this.height();
  }

  bgColor = computed(() => {
    const valores = this.values();
    return namedColorModels[this.model()].convert([valores[0], valores[1], valores[2]]);
  });

  private clampValue(index: number, value?: number): number {
    return namedColorModels[this.model()].components[index].clampValue(value);
  }
}
