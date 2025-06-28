import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-transition-default], zzTransitionDefault",
  host: {
    class: "transition-all",
  },
})
export class TransitionDefaultDirective {}
