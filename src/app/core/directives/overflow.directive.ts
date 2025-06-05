import { Directive, HostBinding, input } from "@angular/core";

type overflowType = "visible" | "hidden" | "clip" | "scroll" | "auto";

@Directive({
  selector: "[zz-overflow], zzOverflow",
})
export class OverflowDirective {
  tipo = input(undefined, {
    alias: "zz-overflow",
    transform: (value: string | undefined) => {
      if (!value) {
        return undefined;
      }
      const valor = value.toLowerCase().trim();
      return ["visible", "hidden", "clip", "scroll", "auto"].includes(valor) ? valor : undefined;
    },
  });

  @HostBinding("style.overflow")
  get estilos() {
    return this.tipo();
  }
}

@Directive({
  selector: "[zz-overflow-hidden], zzOverflowHidden",
})
export class OverflowHiddenDirective {
  @HostBinding("style.overflow")
  get estilos() {
    return "hidden";
  }
}
@Directive({
  selector: "[zz-overflow-visible], zzOverflowVisible",
})
export class OverflowVisibleDirective {
  @HostBinding("style.overflow")
  get estilos() {
    return "visible";
  }
}

@Directive({
  selector: "[zz-overflow-y-hidden], zzOverflowYHidden",
})
export class OverflowYiddenDirective {
  @HostBinding("style.overflowY")
  get estilos() {
    return "hidden";
  }
}
