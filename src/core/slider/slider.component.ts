import { Component, computed, input, Optional } from "@angular/core";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { DataListComponent } from "./data-list.component";

@Component({
  selector: "app-slider",
  imports: [ReactiveFormsModule, DataListComponent],
  templateUrl: "./slider.component.html",
  host: {
    class: "w-full",
  },
})
export class SliderComponent {
  readonly fieldName = input.required<string>();
  readonly min = input<number>(0);
  readonly max = input<number>(10);
  readonly step = input<number>(1);
  readonly stops = input<number[]>([]);

  protected readonly useTicks = computed(() => this.stops()?.length ?? 0 > 0);

  get formGroup() {
    return this._parentFormGroupDirective?.control;
  }
  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName()];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}
}

