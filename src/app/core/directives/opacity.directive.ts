import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-opacity-95], zzOpacity95",
  host: {
    class: "opacity-95",
  },
})
export class Opacity95Directive {}
