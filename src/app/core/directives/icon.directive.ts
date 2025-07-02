import { Directive } from "@angular/core";
import { InilineBlockDirective } from "./display.directive";

@Directive({
  selector: "span[zz-icon]",
  host: {
    class: "font-icons  text-larger-5 min-w-8 w-8 h-10 content-center",
  },
  hostDirectives: [InilineBlockDirective],
})
export class IconDirective {}
