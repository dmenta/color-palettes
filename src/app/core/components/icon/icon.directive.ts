import { Directive } from "@angular/core";
import { InilineBlockDirective } from "../../directives/display.directive";

@Directive({
  selector: "span[zz-icon]",
  host: {
    class: "font-icons  text-larger-5 min-w-10 w-10 aspect-square content-center",
  },
  hostDirectives: [InilineBlockDirective],
})
export class IconDirective {}
