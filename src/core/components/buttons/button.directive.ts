import { Directive } from "@angular/core";
import { DisabledDirective } from "../../directives/disabled.directive";
import { FocusRingDirective } from "../../directives/focus-ring.directive";

@Directive({
  selector: "[app-button]",
  host: {
    class: `
          appearance-none  select-none inline-block 
          transition-all duration-150
          min-w-fit 
          border-none  rounded-lg  
          bg-black/10 hover:bg-black/20
          dark:bg-gray-300/10  dark:hover:bg-gray-300/20   
          active:scale-90 mx-0.5 
          `,
  },
  hostDirectives: [FocusRingDirective, DisabledDirective],
})
export class BaseButtonDirective {}
