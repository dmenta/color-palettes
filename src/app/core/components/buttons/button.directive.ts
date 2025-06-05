import { Directive } from "@angular/core";
import { DisabledDirective } from "../../directives/disabled.directive";
import { FocusRingDirective } from "../../directives/focus-ring.directive";
import { ActiveDirective } from "../../directives/active.directive";
import { RoundedDirective } from "../../directives/rounded.directive";
import { InilineBlockDirective } from "../../directives/display.directive";
import { ButtonBackgroundDirective } from "../../directives/background.directive";
import {
  AppearanceNoneDirective,
  Opacity95Directive,
  SelectNoneDirective,
} from "../../directives/appearance-none.directive";
import { TransitionAllDirective, TransitionDefaultDirective } from "../../directives/transition.directive";

@Directive({
  selector: "[zz-button]",
  host: {
    class: `
          min-w-fit mx-0.5 
          hover:bg-black/20
            dark:hover:bg-gray-300/20   
          `,
    "(click)": "onClick($event)",
  },
  hostDirectives: [
    ButtonBackgroundDirective,
    FocusRingDirective,
    Opacity95Directive,
    { directive: DisabledDirective, inputs: ["zz-disabled: zzDisabled"] },
    ActiveDirective,
    InilineBlockDirective,
    TransitionDefaultDirective,
    SelectNoneDirective,
    AppearanceNoneDirective,
    { directive: RoundedDirective, inputs: ["zz-rounded:roundedSize"] },
  ],
})
export class BaseButtonDirective {
  onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
