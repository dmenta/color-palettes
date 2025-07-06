import { Directive, inject } from "@angular/core";
import { GradientStateService } from "../services/gradient-state.service";

@Directive({
  selector: "[zz-gradient-reference]",
  host: {
    "[style.background]":
      "'linear-gradient(to right in oklch, ' + this.state.startColor() + ' 0%, ' + this.state.endColor() + ' 100%)'",
  },
})
export class GradientReferenceDirective {
  state = inject(GradientStateService);
}
