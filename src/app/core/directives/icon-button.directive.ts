import { Directive } from "@angular/core";
import { BaseButtonDirective } from "./button.directive";

@Directive({
  selector: "[zz-icon-button]",
  hostDirectives: [BaseButtonDirective],
})
export class IconButtonDirective {}
