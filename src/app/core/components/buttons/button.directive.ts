import { Directive } from "@angular/core";
import { DisabledDirective } from "../../directives/disabled.directive";
import { FocusRingDirective } from "../../directives/focus-ring.directive";
import { ActiveDirective } from "../../directives/active.directive";
import { RoundedDirective } from "../../directives/rounded.directive";
import { InilineBlockDirective } from "../../directives/display.directive";
import { ButtonBackgroundDirective, ButtonHoverDirective } from "../../directives/background.directive";
import {
  AppearanceNoneDirective,
  Opacity95Directive,
  SelectNoneDirective,
} from "../../directives/appearance-none.directive";
import { TransitionDefaultDirective } from "../../directives/transition.directive";

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
    FocusRingDirective,
    { directive: DisabledDirective, inputs: ["zz-disabled: zzDisabled"] },
  ],
})
export class BaseButtonDirective {
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
