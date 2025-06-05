import { Directive, HostBinding, signal } from "@angular/core";

@Directive({
  selector: "[zz-background-base], zzBackgroundBase",
})
export abstract class BackgroundBaseDirective {
  abstract light: string;
  abstract dark: string;

  @HostBinding("style.backgroundColor")
  get backgroundColor(): string {
    return `light-dark(${this.light}, ${this.dark})`;
  }
}

@Directive({
  selector: "[zz-background], zzBackground",
})
export class BackgroundDirective extends BackgroundBaseDirective {
  light = "oklch(98.5% 0.002 247.839)";
  dark = "oklch(21% 0.034 264.665)";
}

@Directive({
  selector: "[zz-container-background], zzContainerBackground",
})
export class ContainerBackgroundDirective extends BackgroundBaseDirective {
  light = "oklch(87.2% 0.01 258.338 / 0.15)";
  dark = "oklch(0.28 0.03 256.85 / .5)";
}

@Directive({
  selector: "[zz-button-background], zzButtonBackground",
})
export class ButtonBackgroundDirective extends BackgroundBaseDirective {
  light = "#00000015";
  dark = "oklch(87.2% 0.01 258.338 / .1)";
}

// bg-black/10 hover:bg-black/20
// dark:bg-gray-300/10  dark:hover:bg-gray-300/20
//    class: `dark:bg-gray-800/50 bg-gray-300/5`,
/*
  --color-orange-300: oklch(83.7% 0.128 66.29);
  --color-orange-400: oklch(75% 0.183 55.934);
  --color-sky-400: oklch(74.6% 0.16 232.661);
  --color-sky-500: oklch(68.5% 0.169 237.323);
  --color-sky-600: oklch(58.8% 0.158 241.966);
  --color-sky-700: oklch(50% 0.134 242.749);
  --color-blue-400: oklch(70.7% 0.165 254.624);
  --color-gray-50: oklch(98.5% 0.002 247.839);
  --color-gray-100: oklch(96.7% 0.003 264.542);
  --color-gray-200: oklch(92.8% 0.006 264.531);
  --color-gray-300: oklch(87.2% 0.01 258.338);
  --color-gray-400: oklch(70.7% 0.022 261.325);
  --color-gray-500: oklch(55.1% 0.027 264.364);
  --color-gray-600: oklch(44.6% 0.03 256.802);
  --color-gray-700: oklch(37.3% 0.034 259.733);
  --color-gray-800: oklch(27.8% 0.033 256.848);
  --color-gray-900: oklch(21% 0.034 264.665);
  --color-black: #000;
  --color-white: #fff;
  --spacing: 0.25rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: calc(1.25 / 0.875);
  --text-lg: 1.125rem;
  --text-lg--line-height: calc(1.75 / 1.125);
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --default-transition-duration: 150ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  --default-font-family: var(--font-sans);
  --default-mono-font-family: var(--font-mono);
  --color-paper-4: #edd1b0;
  --color-paper-5: #f0e4d7;
  */
