import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-transition-default], zzTransitionDefault",
  host: {
    classs: "transition-all",
  },
})
export class TransitionDefaultDirective {}
