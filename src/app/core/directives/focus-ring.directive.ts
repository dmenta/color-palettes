import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-focus-ring], zzFocusRing",
  host: {
    class: `
          group-focus-within:ring-2 group-focus-within:ring-offset-0
          ring-gray-600/50 outline-none  
          dark:ring-gray-300/60
          focus:ring-2 focus:ring-offset-0
          `,
  },
})
export class FocusRingDirective {}
