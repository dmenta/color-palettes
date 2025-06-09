import { computed, Directive, effect, ElementRef, HostBinding, inject, input, Input, Renderer2 } from "@angular/core";
import { KeyDetectorService } from "../../service/ctrlkey-pressed.service";
import { AppearanceNoneDirective } from "../../directives/appearance-none.directive";
import { FlexDirective } from "../../directives/display.directive";
import { WidthFullDirective } from "../../directives/width.directive";

@Directive({
  selector: "input[type='range'][zz-slider]",
  host: {
    class: `h-[.75rem]  cursor-pointer flex-row items-center focus:outline-none 
[&::-webkit-slider-thumb]:shadow-md
[&::-webkit-slider-thumb]:shadow-black 
[&::-webkit-slider-thumb]:transition-all
[&::-webkit-slider-thumb]:duration-150  
focus:[&::-webkit-slider-thumb]:outline-zinc-500  
dark:focus:[&::-webkit-slider-thumb]:outline-zinc-300
[&::-webkit-slider-thumb]:mt-[-0.35rem]
[&::-webkit-slider-thumb]:h-[.75rem]
[&::-webkit-slider-thumb]:w-[.75rem]
[&::-webkit-slider-thumb]:appearance-none 
[&::-webkit-slider-thumb]:rounded-full
focus:[&::-webkit-slider-thumb]:outline-2
focus:[&::-webkit-slider-thumb]:outline-offset-0
[&::-webkit-slider-runnable-track]:h-[.125rem]
[&::-webkit-slider-runnable-track]:rounded-full
[&::-webkit-slider-runnable-track]:bg-black/20 
 focus:[&::-webkit-slider-runnable-track]:bg-black/50 
 dark:[&::-webkit-slider-runnable-track]:bg-white/30
  focus:dark:[&::-webkit-slider-runnable-track]:bg-white/50`,
  },
  hostDirectives: [WidthFullDirective, AppearanceNoneDirective, FlexDirective],
})
export class SliderSlimDirective {
  accent = input(false);

  step = input(1, {
    alias: "zzStep",
    transform: (value?: number) => Math.max(Math.min(100, value ?? 1), 0.01),
  });

  @HostBinding("step")
  get stepCorregido() {
    return this.resolvedStep();
  }

  keyPressedService = inject(KeyDetectorService);
  resolvedStep = computed(() => {
    const step = this.step();
    if (!this.keyPressedService.controlPressed()) {
      return step;
    }
    const entero = Number.isInteger(step);
    if (entero) {
      return 1;
    }

    return step >= 2 ? 0.5 : 0.2;
  });

  toggleAccent = {
    false: ["dark:[&::-webkit-slider-thumb]:bg-blue-400", "[&::-webkit-slider-thumb]:bg-sky-400/90"],
    true: ["dark:[&::-webkit-slider-thumb]:bg-orange-400", "[&::-webkit-slider-thumb]:bg-orange-300"],
  } as { [key: string]: string[] };

  constructor(private el: ElementRef, private renderer: Renderer2) {
    effect(() => {
      const accent = this.accent() ?? false;
      this.toggleAccent[accent.toString()].forEach((clase) => this.renderer.addClass(this.el.nativeElement, clase));
      this.toggleAccent[(!accent).toString()].forEach((clase) =>
        this.renderer.removeClass(this.el.nativeElement, clase)
      );
    });
  }
}
