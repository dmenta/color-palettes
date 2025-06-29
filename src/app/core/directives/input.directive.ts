import { Directive } from "@angular/core";
import { DisabledDirective } from "./disabled.directive";
import { InilineBlockDirective } from "./display.directive";

@Directive({
  selector: "[zz-input], zzInput",
  hostDirectives: [InilineBlockDirective, { directive: DisabledDirective, inputs: ["zz-disabled:zzDisabled"] }],
  host: {
    class:
      "py-1 ring-none px-1 transition-all transition-discrete focus:px-0 focus:[&::-webkit-inner-spin-button]:block [&::-webkit-inner-spin-button]:hidden  outline-none border-b-1 border-b-gris-500/80  dark:focus:border-b-sky-600  focus:border-b-sky-600 w-12 text-right dark:text-gris-100 text-gris-900 invalid:dark:border-b-red-500 invalid:border-b-red-700 dark:bg-gris-900",
  },
})
export class InputDirective {}
