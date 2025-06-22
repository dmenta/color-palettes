import { computed, Directive, HostBinding, input } from "@angular/core";
import { ColorModelName, componentKey } from "../../model/colors.model";
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
  Aaxis = input(60, { alias: "componentA", transform: (value?: number) => this.clampValue("A", value) });
  Baxis = input(70, { alias: "componentB", transform: (value?: number) => this.clampValue("B", value) });
  Caxis = input(80, { alias: "componentC", transform: (value?: number) => this.clampValue("C", value) });

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

  bgColor = computed(() =>
    namedColorModels[this.model()].convert({ A: this.Aaxis(), B: this.Baxis(), C: this.Caxis() })
  );

  private clampValue(component: componentKey, value?: number): number {
    return namedColorModels[this.model()].components[component].clampValue(value);
  }
}
