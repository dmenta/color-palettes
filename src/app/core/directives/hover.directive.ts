import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-hover], zzHover",
  host: {
    class: "hover:bg-hover hover:opacity-100",
  },
})
export class HoverDirective {}

@Directive({
  selector: "[zz-button-hover], zzButtonHover",
  host: {
    class: "hover:bg-button-hover",
  },
})
export class ButtonHoverDirective {}
