import { Directive, inject } from "@angular/core";
import { GRADIENT_STATE_TOKEN } from "../services/gradient-state.model";

@Directive({
  selector: "[zz-gradient-reference]",
  host: {
    "[style.background]":
      "'linear-gradient(to right in oklch, ' + this.state.startColor() + ' 0%, ' + this.state.endColor() + ' 100%)'",
  },
})
export class GradientReferenceDirective {
  state = inject(GRADIENT_STATE_TOKEN);
}
