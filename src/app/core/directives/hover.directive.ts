import { Directive, signal, HostListener, HostBinding } from "@angular/core";

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
