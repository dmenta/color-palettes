import { Directive } from "@angular/core";

@Directive({
  selector: "[app-disabled]",
  host: {
    class: `disabled:opacity-50  disabled:pointer-events-none
          disabled:cursor-not-allowed disabled:select-none
          disabled:shadow-none`,
  },
})
export class DisabledDirective {}
