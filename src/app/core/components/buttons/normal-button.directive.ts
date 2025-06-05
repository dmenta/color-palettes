import { Directive } from "@angular/core";
import { BaseButtonDirective } from "./button.directive";

const spacing = 0.25;

@Directive({
  selector: "[zz-normal-button]",
  host: {
    "[style.height.rem]": "spacing*10",
    "[style.paddingInline.rem]": "spacing*4",
    "[style.paddingBlock.rem]": "spacing*2",
  },
  hostDirectives: [BaseButtonDirective],
})
export class NormalButtonDirective {
  spacing = spacing;
}
