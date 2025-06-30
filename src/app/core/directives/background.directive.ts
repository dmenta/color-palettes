import { Directive } from "@angular/core";

@Directive({
  selector: "[zz-background-base], zzBackgroundBase",
  host: {
    "[class]": "varname",
  },
})
export abstract class BackgroundBaseDirective {
  abstract varname: string;
}

@Directive({
  selector: "[zz-container-background], zzContainerBackground",
})
export class ContainerBackgroundDirective extends BackgroundBaseDirective {
  varname = "bg-container";
}

@Directive({
  selector: "[zz-button-background], zzButtonBackground",
})
export class ButtonBackgroundDirective extends BackgroundBaseDirective {
  varname = "bg-button";
}
