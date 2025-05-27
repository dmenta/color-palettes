import { Component, computed, input, linkedSignal, model, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DataListComponent } from "./data-list.component";

@Component({
  selector: "app-slider",
  imports: [FormsModule, DataListComponent],
  template: `
    <div class="inline-block h-fit w-full">
      <input
        type="range"
        [id]="id()"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        (input)="onInput($event)"
        [value]="value()"
        [class]="classes"
        [attr.list]="useTicks() ? id() + '-datalist' : null" />
    </div>
    @if(useTicks()) {
    <app-data-list [id]="id() + '-datalist'" [values]="stops()"> </app-data-list>
    }
  `,
  host: {
    class: "w-full",
  },
})
export class SliderComponent {
  protected readonly classes = [
    "flex",
    "h-[.75rem]",
    "w-full",
    "cursor-pointer",
    "appearance-none",
    "flex-row",
    "items-center",
    "focus:outline-none",
    "[&::-webkit-slider-thumb]:mt-[-0.25rem]",
    "[&::-webkit-slider-thumb]:h-[.75rem]",
    "[&::-webkit-slider-thumb]:w-[.75rem]",
    "[&::-webkit-slider-thumb]:appearance-none",
    "[&::-webkit-slider-thumb]:rounded-full",
    "[&::-webkit-slider-thumb]:bg-orange-600/80",
    "focus:[&::-webkit-slider-thumb]:outline-offset-1",
    "focus:[&::-webkit-slider-thumb]:outline-2",
    "focus:[&::-webkit-slider-thumb]:outline-orange-400/80",
    "dark:[&::-webkit-slider-thumb]:bg-blue-400/80",
    "dark:focus:[&::-webkit-slider-thumb]:outline-blue-600/80",
    "[&::-webkit-slider-runnable-track]:h-[.25rem]",
    "[&::-webkit-slider-runnable-track]:rounded-full",
    "[&::-webkit-slider-runnable-track]:bg-black/20",
    "dark:[&::-webkit-slider-runnable-track]:bg-white/30",
  ];

  readonly id = input<string>(`slider-${new Date().getTime()}`);
  readonly disabled = input<boolean>(false);

  readonly value = input<number>(0);

  readonly min = input<number>(0);
  readonly max = input<number>(10);
  readonly step = input<number>(1);
  readonly stops = input<number[]>([]);

  protected readonly useTicks = computed(() => this.stops()?.length ?? 0 > 0);

  readonly valueChanged = output<number>();

  protected onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChanged.emit(Number(target.value));
  }
}

