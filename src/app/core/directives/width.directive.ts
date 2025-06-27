import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-width-full], zzWidthFull",
  host: {
    class: "w-full",
  },
})
export class WidthFullDirective {}
