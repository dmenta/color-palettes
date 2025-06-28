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

@Directive({
  selector: "[zz-select-none], zzSelectNone",
  host: {
    class: "select-none",
  },
})
export class SelectNoneDirective {}

@Directive({
  selector: "[zz-opacity-95], zzOpacity95",
  host: {
    class: "opacity-95",
  },
})
export class Opacity95Directive {}
