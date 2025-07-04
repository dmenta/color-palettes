import { computed, Directive, HostBinding, HostListener, input, signal } from "@angular/core";

@Directive({
  selector: "input[type='range'][zz-slider]",
  host: {
    class: "slider-slim",
    "[class.slider-slim-track]": "showTrack()",
    "[class.slider-slim-accent]": "accent()",
  },
})
export class SliderSlimDirective {
  controlPressed = signal(false);

  accent = input(false);

  showTrack = input(true);

  step = input(1, {
    alias: "zzStep",
    transform: (value?: number) => Math.max(Math.min(400, value ?? 1), 0.001),
  });

  @HostBinding("step")
  get stepCorregido() {
    return this.resolvedStep();
  }

  @HostBinding("value")
  get current() {
    return this.value();
  }
  value = input(0, {
    alias: "zzValue",
    transform: (value?: number) => Math.max(Math.min(720, value ?? 0), -720),
  });

  @HostListener("keydown.control", ["$event"])
  onControlKeyDown(event: KeyboardEvent) {
    if (!this.controlPressed()) {
      this.controlPressed.set(true);
      event.preventDefault();
    }
  }

  @HostListener("keyup.control", ["$event"])
  onControlKeyUp(event: KeyboardEvent) {
    if (this.controlPressed()) {
      this.controlPressed.set(false);
      event.preventDefault();
    }
  }

  resolvedStep = computed(() => {
    const step = this.step();
    if (!this.controlPressed()) {
      return step;
    }

    return 10 * step;
  });
}
