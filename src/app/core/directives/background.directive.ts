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
// bg-black/10 hover:bg-black/20
// dark:bg-gris-300/10  dark:hover:bg-gris-300/20
//    class: `dark:bg-gris-800/50 bg-gris-300/5`,
/*
  
  --color-orange-300: oklch(83.7% 0.128 66.29);
  --color-orange-400: oklch(75% 0.183 55.934);
  --color-sky-400: oklch(74.6% 0.16 232.661);
  --color-sky-500: oklch(68.5% 0.169 237.323);
  --color-sky-600: oklch(58.8% 0.158 241.966);
  --color-sky-700: oklch(50% 0.134 242.749);
  --color-blue-400: oklch(70.7% 0.165 254.624);
  --color-gris-50: oklch(98.5% 0.002 247.839);
  --color-gris-100: oklch(96.7% 0.003 264.542);
  --color-gris-200: oklch(92.8% 0.006 264.531);
  --color-gris-300: oklch(87.2% 0.01 258.338);
  --color-gris-400: oklch(70.7% 0.022 261.325);
  --color-gris-500: oklch(55.1% 0.027 264.364);
  --color-gris-600: oklch(44.6% 0.03 256.802);
  --color-gris-700: oklch(37.3% 0.034 259.733);
  --color-gris-800: oklch(27.8% 0.033 256.848);
  --color-gris-900: oklch(21% 0.034 264.665);
  --spacing: 0.25rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-lg: 1.125rem;
  --text-lg--line-height: calc(1.75 / 1.125);
  --color-paper-4: #edd1b0;
  --color-paper-5: #f0e4d7;

  */
