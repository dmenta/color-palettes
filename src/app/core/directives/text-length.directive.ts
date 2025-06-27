import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[zz-text-length], zzTextLength",
  host: {
    class: "truncate",
  },
})
export class TextLengthDirective {
  length = input(undefined, {
    alias: "zz-text-length",
    transform: (value?: number) => {
      const valor = Math.max(0, value ?? 0);
      return Number.isInteger(valor) ? valor : undefined;
    },
  });

  @HostBinding("style.opacity")
  get estilosOpacity() {
    return "0.95";
  }
  @HostBinding("style.userSelect")
  get estilosUserSelect() {
    return "none";
  }
  @HostBinding("style.width.ch")
  get width() {
    return this.length();
  }
}
