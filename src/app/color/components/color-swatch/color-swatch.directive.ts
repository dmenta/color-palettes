import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModel, Triple } from "../../model/colors.model";
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
  selector: "[color-swatch-full]",
  hostDirectives: [
    { directive: ColorSwatchDirective, inputs: ["color-model", "values"] },
    { directive: WidthFullDirective },
  ],
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
  hostDirectives: [{ directive: ColorSwatchDirective, inputs: ["color-model", "values"] }],
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
