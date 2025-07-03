import { Directive } from "@angular/core";
import { DisabledDirective } from "./disabled.directive";
import { FocusRingDirective } from "./focus-ring.directive";
import { RoundedDirective } from "./rounded.directive";
import { InilineBlockDirective } from "./display.directive";
import { ButtonBackgroundDirective } from "./background.directive";
import { TransitionDefaultDirective } from "./transition.directive";
import { ButtonHoverDirective } from "./hover.directive";
import { SelectNoneDirective } from "./user-select.directive";

@Directive({
  selector: "[zz-button]",
  host: {
    class: `appearance-none active:not-disabled:scale-90 min-w-fit mx-0.5 cursor-pointer
          `,
    "(click)": "onClick($event)",
  },
  hostDirectives: [
    InilineBlockDirective,
    SelectNoneDirective,
    TransitionDefaultDirective,
    ButtonBackgroundDirective,
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
    ButtonHoverDirective,
    { directive: FocusRingDirective, inputs: ["show-focus-ring: focus-ring"] },
    { directive: DisabledDirective, inputs: ["zz-disabled: zzDisabled"] },
  ],
})
export class BaseButtonDirective {
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
