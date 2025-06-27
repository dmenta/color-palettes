import { Directive, input } from "@angular/core";

@Directive({
  selector: "[zz-shadow], zzShadow",
  host: {
    "[class.shadow-md/50]": "show()",
    "[class.shadow-black]": "show()",
  },
})
export class ShadowDirective {
  show = input(true, { alias: "zz-shadow" });
}
