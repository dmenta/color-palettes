import { Directive, input } from "@angular/core";
import { BlockDirective } from "./display.directive";
import { OverflowYiddenDirective } from "./overflow.directive";
import { TransitionDefaultDirective } from "./transition.directive";

@Directive({
  selector: "[zz-collapse-vertical], zzCollapseVertical",
  host: {
    "[style.height]": "collapse() ? '0':'calc-size(auto, size)'",
    "[class.opacity-50]": "collapse()",
  },
  hostDirectives: [BlockDirective, OverflowYiddenDirective, TransitionDefaultDirective],
})
export class CollapseVerticalDirective {
  collapse = input(false, { alias: "zz-collapse-vertical" });
}
