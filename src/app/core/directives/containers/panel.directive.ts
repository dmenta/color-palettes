import { Directive } from "@angular/core";
import { ShadowDirective } from "../shadow.directive";
import { RoundedContainerDirective } from "./rounded-container.directive";
import { TransitionDefaultDirective } from "../transition.directive";

@Directive({
  selector: "[zz-panel]",
  hostDirectives: [
    RoundedContainerDirective,
    { directive: ShadowDirective, inputs: ["zz-shadow:shadow"] },
    TransitionDefaultDirective,
  ],
})
export class PanelDirective {}
