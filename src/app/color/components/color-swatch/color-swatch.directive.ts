import { computed, Directive, HostBinding, HostListener, input } from "@angular/core";
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
  model = input<ColorModel | undefined>(undefined);
  values = input<Triple<number> | undefined>(undefined);

  @HostBinding("style.backgroundColor")
  get background() {
    return this.bgColor() ?? "black";
  }
  bgColor = computed(() => {
    const model = this.model();
    if (!model) {
      return undefined;
    }

    const valores = this.values();
    return model.convert([valores[0], valores[1], valores[2]]);
  });
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
