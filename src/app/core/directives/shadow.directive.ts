import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[zz-shadow], zzShadow",
})
export class ShadowDirective {
  show = input(true, { alias: "zz-shadow" });

  @HostBinding("style.boxShadow")
  get shadow() {
    if (!this.show()) {
      return "none";
    }
    return "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, light-dark(oklab(0 0 0 / 0.25), oklab(0 0 0 / 0.8)) 0px 4px 6px -1px, light-dark(oklab(0 0 0 / 0.25), oklab(0 0 0 / 0.8)) 0px 2px 4px -2px";
  }
}
