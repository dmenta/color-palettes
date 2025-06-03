import { Directive } from "@angular/core";

@Directive({
  selector: "span[app-icon]",
  host: {
    class: "material-symbols-rounded inline-block min-w-10 w-10 aspect-square content-center",
  },
})
export class IconDirective {}
