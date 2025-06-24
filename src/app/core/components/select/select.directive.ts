import { Directive, HostBinding } from "@angular/core";
import { AppearanceBaseSelectDirective } from "../../directives/appearance-none.directive";
import { FocusRingDirective } from "../../directives/focus-ring.directive";
import { DisabledDirective } from "../../directives/disabled.directive";
import { RoundedDirective } from "../../directives/rounded.directive";
import { WidthFullDirective } from "../../directives/width.directive";
import { InilineBlockDirective } from "../../directives/display.directive";

@Directive({
  selector: "[zz-select], zzSelect",
  hostDirectives: [
    AppearanceBaseSelectDirective,
    InilineBlockDirective,
    RoundedDirective,
    WidthFullDirective,
    FocusRingDirective,
    { directive: DisabledDirective, inputs: ["zz-disabled:zzDisabled"] },
  ],
})
export class SelectDirective {
  @HostBinding("class.zz-select")
  get baseSelectClass(): boolean {
    return true;
  }
}

@Directive({
  selector: "[zz-input], zzInput",
  hostDirectives: [
    InilineBlockDirective,
    RoundedDirective,
    FocusRingDirective,
    { directive: DisabledDirective, inputs: ["zz-disabled:zzDisabled"] },
  ],
  host: {
    class: "p-1 border-1 border-gray-500 w-14 text-right invalid:dark:border-red-500 invalid:border-red-700",
  },
})
export class InputDirective {}
