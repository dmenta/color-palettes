import { Directive, HostBinding, input } from "@angular/core";

const baseRadius = 0.125;

@Directive({
  selector: "[zz-rounded], zzRounded",
  host: {
    class: "overflow-hidden",
  },
})
export class RoundedDirective {
  radius = input("small", {
    alias: "zz-rounded",
    transform: (value?: string | borderRadius) => {
      const valor = (value ?? "none").toLowerCase().trim();
      if (valor === "none") {
        return "none";
      }
      return valor === "normal" ? "normal" : valor === "large" ? "large" : "small";
    },
  });

  @HostBinding("style.borderRadius.rem")
  get estilos(): number | undefined {
    const radius = this.radius();
    if (radius === "none") {
      return undefined;
    }
    return baseRadius * (radius === "normal" ? 3 : radius === "small" ? 2 : 4);
  }
}
export type borderRadius = "small" | "normal" | "large" | "none";
