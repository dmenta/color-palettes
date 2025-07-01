import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-button-hover], zzButtonHover",
  host: {
    class: "hover:bg-button-hover",
  },
})
export class ButtonHoverDirective {}
