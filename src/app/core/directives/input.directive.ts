import { Directive } from "@angular/core";
import { DisabledDirective } from "./disabled.directive";
import { InilineBlockDirective } from "./display.directive";
import { FocusRingDirective } from "./focus-ring.directive";
import { RoundedDirective } from "./rounded.directive";

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
