import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-background-base], zzBackgroundBase",
})
export abstract class BackgroundBaseDirective {
  abstract varname: string;

  @HostBinding("style.backgroundColor")
  get backgroundColor(): string {
    return `var(--${this.varname})`;
  }
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
