import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-shadow], zzShadow",
  host: {
    class: `shadow-md/10 shadow-gray-300 dark:shadow-gray-700`,
  },
})
export class ShadowDirective {}
