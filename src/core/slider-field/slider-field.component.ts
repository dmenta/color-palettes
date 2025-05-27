import { Component, input, linkedSignal, model, output } from "@angular/core";
import { SliderComponent } from "../slider/slider.component";
import { FieldLabelComponent } from "./field-label.component";
import { FieldValueComponent } from "./field-value.component";

@Component({
  selector: "app-slider-field",
  imports: [SliderComponent, FieldLabelComponent, FieldValueComponent],
  template: `<div class="flex w-full flex-row items-center justify-between gap-[1ch]">
    @if(showLabel()) {
    <app-field-label [for]="id" [text]="label()" [length]="labelLength()"></app-field-label>
    }

    <app-slider
      [id]="id"
      [disabled]="disabled()"
      [min]="min()"
      [max]="max()"
      [value]="currentValue()"
      [step]="step()"
      [stops]="stops()"
      (valueChanged)="onValueChanged($event)"></app-slider>

    @if(showValue()) {
    <app-field-value [value]="currentValue()" [length]="valueLength()" [suffix]="suffix()"> </app-field-value>
    }
  </div>`,
  host: {
    class: "w-full",
  },
})
export class SliderFieldComponent {
  protected readonly id = `value-slider-${new Date().getTime()}`;

  readonly disabled = input<boolean>(false);

  readonly value = input<number>(0);

  readonly currentValue = linkedSignal({
    source: this.value,
    computation: (value) => value,
  });

  readonly min = input<number>(0);
  readonly max = input<number>(10);
  readonly step = input<number>(1);
  readonly stops = input<number[]>([]);

  readonly labelLength = input<number | null | undefined>(undefined);
  readonly label = input("", { transform: (value?: string) => value?.trim() ?? "" });
  readonly showLabel = input(false, { transform: (value?: boolean) => value ?? false });

  readonly valueLength = input<number | null | undefined>(undefined);
  readonly suffix = input("", { transform: (value?: string) => value?.trim() ?? "" });
  readonly showValue = input(false, { transform: (value?: boolean) => value ?? false });

  readonly valueChanged = output<number>();

  protected onValueChanged(value: number) {
    this.currentValue.set(value);
    this.valueChanged.emit(value);
  }
}
