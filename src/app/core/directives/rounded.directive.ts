import { Directive, HostBinding, input } from "@angular/core";
import { OverflowHiddenDirective } from "./overflow.directive";

const baseRadius = 0.125;

@Directive({
  selector: "[zz-rounded], zzRounded",
  hostDirectives: [OverflowHiddenDirective],
})
export class RoundedDirective {
  radius = input("small", {
    alias: "zz-rounded",
    transform: (value?: string | borderRadius) => {
      const valor = (value ?? "small").toLowerCase().trim();
      console.log("RoundedDirective radius:", valor);
      return valor === "normal" ? "normal" : valor === "large" ? "large" : "small";
    },
  });

  @HostBinding("style.borderRadius.rem")
  get estilos(): number {
    const radius = this.radius();
    return baseRadius * (radius === "normal" ? 3 : radius === "small" ? 2 : 4);
  }
}
type borderRadius = "small" | "normal" | "large";
