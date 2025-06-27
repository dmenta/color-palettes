import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[zz-display], zzDisplay",
})
export class DisplayDirective {
  tipo = input(undefined, {
    alias: "zz-display",
    transform: (value: string | undefined) => {
      if (!value) {
        return undefined;
      }
      const valor = value.toLowerCase().trim();
      return ["inline-block", "block", "flex", "grid", "none"].includes(valor) ? valor : undefined;
    },
  });

  @HostBinding("style.display")
  get estilos() {
    return this.tipo();
  }
}

@Directive({
  selector: "[zz-display-base], zzDisplayBase",
})
export abstract class DisplayBaseDirective {
  abstract tipo: string;

  @HostBinding("style.display")
  get backgroundColor(): string {
    return this.tipo;
  }
}

@Directive({
  selector: "[zz-inline-block], zzInlineBlock",
})
export class InilineBlockDirective extends DisplayBaseDirective {
  override tipo = "inline-block";
}

@Directive({
  selector: "[zz-block], zzBlock",
})
export class BlockDirective extends DisplayBaseDirective {
  override tipo = "block";
}
@Directive({
  selector: "[zz-flex], zzFlex",
})
export class FlexDirective extends DisplayBaseDirective {
  override tipo = "flex";
}
