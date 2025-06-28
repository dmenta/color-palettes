import { Directive, HostBinding, HostListener, signal } from "@angular/core";

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
  selector: "[zz-background], zzBackground",
})
export class BackgroundDirective extends BackgroundBaseDirective {
  varname = "bg-application";
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

@Directive({
  selector: "[zz-hover], zzHover",
})
export class HoverDirective {
  hover = signal(false);

  @HostListener("mouseenter")
  onMouseEnter() {
    this.hover.set(true);
  }

  @HostListener("mouseleave")
  onMouseOut() {
    this.hover.set(false);
  }

  @HostBinding("style.backgroundColor")
  get backgroundColor(): string | undefined {
    if (this.hover()) {
      return "var(--bg-hover)";
    }
    return undefined;
  }

  @HostBinding("style.opacity")
  get opacity() {
    if (this.hover()) {
      return "1";
    }
    return undefined;
  }
}

@Directive({
  selector: "[zz-button-hover], zzButtonHover",
})
export class ButtonHoverDirective {
  hover = signal(false);

  @HostListener("mouseenter")
  onMouseEnter() {
    this.hover.set(true);
  }

  @HostListener("mouseleave")
  onMouseOut() {
    this.hover.set(false);
  }

  @HostBinding("style.backgroundColor")
  get backgroundColor(): string | undefined {
    if (this.hover()) {
      return "var(--bg-button-hover)";
    }
    return undefined;
  }

  @HostBinding("style.opacity")
  get opacity() {
    if (this.hover()) {
      return "1";
    }
    return undefined;
  }
}
