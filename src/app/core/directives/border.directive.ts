import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[zz-border], zzBorder",

  standalone: true,
})
export class BorderDirective {
  size = input("thin", {
    alias: "zz-border",
    transform: (value: string | undefined) => {
      const valor = (value ?? "none").toLowerCase().trim();
      if (valor === "none") {
        return "none";
      }
      return ["thin", "normal", "thick"].includes(valor) ? valor : "thin";
    },
  });

  color = input("color-mix(in oklch, var(--text-color), transparent 70%)", {
    alias: "zz-border-color",
    transform: (value: string | undefined) => {
      const valor = (value ?? "").trim().replace(/ /g, "-").toLowerCase();
      return valor === "" ? undefined : valor;
    },
  });

  style = input("solid", {
    alias: "zz-border-style",
    transform: (value: string | undefined) => {
      const valor = (value ?? "solid").toLowerCase().trim();
      return ["solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"].includes(valor)
        ? valor
        : "solid";
    },
  });

  @HostBinding("style.borderWidth.px")
  protected get borderSize(): number | undefined {
    if (!this.size()) {
      return undefined;
    }
    return {
      thin: 1,
      normal: 2,
      thick: 4,
    }[this.size()];
  }

  @HostBinding("style.borderColor")
  protected get borderColor(): string | undefined {
    return this.color();
  }

  @HostBinding("style.borderStyle")
  protected get borderStyle(): string | undefined {
    return this.style();
  }
}
