import { Component, input, Optional } from "@angular/core";
import { SliderComponent } from "../slider/slider.component";
import { FieldLabelComponent } from "./field-label.component";
import { FieldValueComponent } from "./field-value.component";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-slider-field",
  imports: [ReactiveFormsModule, SliderComponent, FieldLabelComponent, FieldValueComponent],
  templateUrl: "./slider-field.component.html",
  host: {
    class: "w-full",
  },
})
export class SliderFieldComponent {
  readonly fieldName = input.required<string>();
  readonly min = input<number>(0);
  readonly max = input<number>(10);
  readonly step = input<number>(1);
  readonly stops = input<number[]>([]);

  readonly labelLength = input<number | null | undefined>(undefined);
  readonly label = input("", { transform: (value?: string) => value?.trim() ?? "" });
  readonly showLabel = input(false, { transform: (value?: boolean) => value ?? false });

  readonly valueLength = input<number | null | undefined>(undefined);
  readonly unit = input("", { transform: (value?: string) => value?.trim() ?? "" });
  readonly showValue = input(false, { transform: (value?: boolean) => value ?? false });

  get value() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName()].value;
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}
}
