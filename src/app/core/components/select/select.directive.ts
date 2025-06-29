import { Directive, HostBinding } from "@angular/core";
import { AppearanceBaseSelectDirective } from "../../directives/appearance-none.directive";
import { DisabledDirective } from "../../directives/disabled.directive";
import { WidthFullDirective } from "../../directives/width.directive";
import { InilineBlockDirective } from "../../directives/display.directive";

@Directive({
  selector: "select[zz-select], zzSelect",
  hostDirectives: [
    AppearanceBaseSelectDirective,
    InilineBlockDirective,
    WidthFullDirective,
    { directive: DisabledDirective, inputs: ["zz-disabled:zzDisabled"] },
  ],
  host: {
    class: `[&::picker-icon]:font-icons    
  [&::picker-icon]:opacity-80
[&::picker-icon]:text-larger-5
[&::picker-icon]:leading-[1lh]
transition-all
ring-none  outline-none border-b-1 border-b-gris-500/80  dark:focus:border-b-sky-600  focus:border-b-sky-600`,
  },
})
export class SelectDirective {
  @HostBinding("class.zz-select")
  get baseSelectClass(): boolean {
    return true;
  }
}
