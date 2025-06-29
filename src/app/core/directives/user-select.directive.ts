import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-select-none], zzSelectNone",
  host: {
    class: "select-none",
  },
})
export class SelectNoneDirective {}
