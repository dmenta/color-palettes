import { Directive } from "@angular/core";
import { BaseButtonDirective } from "./button.directive";

@Directive({
  selector: "[app-icon-button]",
  hostDirectives: [BaseButtonDirective],
})
export class IconButtonDirective {}
