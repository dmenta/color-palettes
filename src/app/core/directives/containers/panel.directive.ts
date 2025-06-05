import { Directive } from "@angular/core";
import { ShadowDirective } from "../shadow.directive";
import { RoundedContainerDirective } from "./rounded-container.directive";

@Directive({
  selector: "[zz-panel]",
  hostDirectives: [RoundedContainerDirective, ShadowDirective],
})
export class PanelDirective {}
