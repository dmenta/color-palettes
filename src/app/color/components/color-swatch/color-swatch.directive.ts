import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModelName, Triple } from "../../model/colors.model";
import { namedColorModels } from "../../model/color-models-definitions";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { WidthFullDirective } from "../../../core/directives/width.directive";

@Directive({
  selector: "[color-swatch]",
  hostDirectives: [
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
    { directive: ShadowDirective, inputs: ["zz-shadow:shadow"] },
  ],
})
export class ColorSwatchDirective {
  model = input<ColorModelName>("rgb");
  values = input([50, 1, 200], {
    transform: (values?: Triple<number>) => [...(values?.map((v, i) => this.clampValue(i, v)) ?? [0, 0, 0])],
  });

  @HostBinding("style.backgroundColor")
  get background() {
    return this.bgColor();
  }
  bgColor = computed(() => {
    const valores = this.values();
    return namedColorModels[this.model()].convert([valores[0], valores[1], valores[2]]);
  });

  private clampValue(index: number, value?: number): number {
    return namedColorModels[this.model()].components[index].clampValue(value);
  }
}

@Directive({
  selector: "[color-swatch-full]",
  hostDirectives: [{ directive: ColorSwatchDirective, inputs: ["model", "values"] }, { directive: WidthFullDirective }],
})
export class FullWidthColorSwatchDirective {
  height = input(50);

  @HostBinding("style.height.px")
  get heightResolved() {
    return this.height();
  }
}

@Directive({
  selector: "[color-swatch-square]",
  hostDirectives: [{ directive: ColorSwatchDirective, inputs: ["model", "values"] }],
})
export class SquareColorSwatchDirective {
  width = input<number | "full">("full");

  @HostBinding("style.width")
  get widthResolved() {
    const width = this.width();
    return width === "full" ? "100%" : `${width}px`;
  }

  @HostBinding("style.aspectRatio")
  get heightResolved() {
    return "1 / 1";
  }
}
