import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-active], zzActive",
  host: {
    class: `active:not-disabled:scale-90`,
  },
})
export class ActiveDirective {}
