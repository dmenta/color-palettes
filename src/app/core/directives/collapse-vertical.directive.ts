import { Directive, input } from "@angular/core";
import { BlockDirective } from "./display.directive";
import { TransitionDefaultDirective } from "./transition.directive";

@Directive({
  selector: "[zz-collapse-vertical], zzCollapseVertical",
  host: {
    "[style.height]": "collapse() ? '0':'calc-size(auto, size)'",
    "[class.opacity-50]": "collapse()",
    class: "overflow-y-hidden",
  },
  hostDirectives: [BlockDirective, TransitionDefaultDirective],
})
export class CollapseVerticalDirective {
  collapse = input(false, { alias: "zz-collapse-vertical" });
}
