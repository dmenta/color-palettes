import {
  computed,
  Directive,
  effect,
  ElementRef,
  HostBinding,
  HostListener,
  input,
  Renderer2,
  signal,
} from "@angular/core";
import { AppearanceNoneDirective } from "./appearance-none.directive";
import { FlexDirective } from "./display.directive";

@Directive({
  selector: "input[type='range'][zz-slider]",
  host: {
    class: `h-[.75rem]  cursor-pointer flex-row items-center focus:outline-none 
[&::-webkit-slider-thumb]:shadow-md
[&::-webkit-slider-thumb]:shadow-black 
[&::-webkit-slider-thumb]:transition-all
[&::-webkit-slider-thumb]:duration-150  
focus:[&::-webkit-slider-thumb]:outline-gris-500  
dark:focus:[&::-webkit-slider-thumb]:outline-gris-300
[&::-webkit-slider-thumb]:mt-[-0.35rem]
[&::-webkit-slider-thumb]:h-[.75rem]
[&::-webkit-slider-thumb]:w-[.75rem]
[&::-webkit-slider-thumb]:appearance-none 
[&::-webkit-slider-thumb]:rounded-full
focus:[&::-webkit-slider-thumb]:outline-2
focus:[&::-webkit-slider-thumb]:outline-offset-0
[&::-webkit-slider-runnable-track]:h-[.125rem]
[&::-webkit-slider-runnable-track]:rounded-full w-full
`,
    "[class]": `{'dark:[&::-webkit-slider-runnable-track]:bg-white/30':showTrack(), 
          '[&::-webkit-slider-runnable-track]:bg-black/20': showTrack(),
          'focus:[&::-webkit-slider-runnable-track]:bg-black/50':showTrack(), 
          'focus:dark:[&::-webkit-slider-runnable-track]:bg-white/50':showTrack()}`,
  },
  hostDirectives: [AppearanceNoneDirective, FlexDirective],
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
      console.debug("Control key pressed", event);
      event.preventDefault();
    }
  }

  @HostListener("keyup.control", ["$event"])
  onControlKeyUp(event: KeyboardEvent) {
    if (this.controlPressed()) {
      this.controlPressed.set(false);
      console.debug("Control key released", event);
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

  toggleAccent = {
    false: ["dark:[&::-webkit-slider-thumb]:bg-blue-400", "[&::-webkit-slider-thumb]:bg-sky-400/90"],
    true: ["dark:[&::-webkit-slider-thumb]:bg-orange-400", "[&::-webkit-slider-thumb]:bg-orange-300"],
  } as { [key: string]: string[] };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      const accent = this.accent() ?? false;
      this.toggleAccent[accent.toString()]?.forEach((clase) => this.renderer.addClass(this.el.nativeElement, clase));
      this.toggleAccent[(!accent).toString()]?.forEach((clase) =>
        this.renderer.removeClass(this.el.nativeElement, clase)
      );
    });
  }
}
