import { Directive } from "@angular/core";
import { DisabledDirective } from "./disabled.directive";
import { InilineBlockDirective } from "./display.directive";

@Directive({
  selector: "select[zz-select], zzSelect",
  hostDirectives: [InilineBlockDirective, { directive: DisabledDirective, inputs: ["zz-disabled:zzDisabled"] }],
  host: { class: "select-slim" },
})
export class SelectDirective {}
