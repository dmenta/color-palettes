import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-appearance-none], zzAppearanceNone",
  host: {
    class: "appearance-none",
  },
})
export class AppearanceNoneDirective {}

@Directive({
  selector: "[zz-appearance-base-select], zzAppearanceBaseSelect",
})
export class AppearanceBaseSelectDirective {
  @HostBinding("style.appearance")
  get estilos() {
    return "base-select";
  }
}
