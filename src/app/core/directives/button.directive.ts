import { Directive } from "@angular/core";
import { DisabledDirective } from "./disabled.directive";
import { FocusRingDirective } from "./focus-ring.directive";
import { ActiveDirective } from "./active.directive";
import { RoundedDirective } from "./rounded.directive";
import { InilineBlockDirective } from "./display.directive";
import { ButtonBackgroundDirective } from "./background.directive";
import { AppearanceNoneDirective } from "./appearance-none.directive";
import { TransitionDefaultDirective } from "./transition.directive";
import { ButtonHoverDirective } from "./hover.directive";
import { SelectNoneDirective } from "./user-select.directive";
import { Opacity95Directive } from "./opacity.directive";

@Directive({
  selector: "[zz-button]",
  host: {
    class: `
          min-w-fit mx-0.5 
          `,
    "(click)": "onClick($event)",
  },
  hostDirectives: [
    AppearanceNoneDirective,
    InilineBlockDirective,
    SelectNoneDirective,
    TransitionDefaultDirective,
    ButtonBackgroundDirective,
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
    ButtonHoverDirective,
    Opacity95Directive,
    ActiveDirective,
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
