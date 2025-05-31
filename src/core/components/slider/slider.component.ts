import { Component, computed, inject, Input, Optional } from "@angular/core";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { DataListComponent } from "./data-list.component";
import { KeyDetectorService } from "../../service/ctrlkey-pressed.service";

@Component({
  selector: "app-slider",
  imports: [ReactiveFormsModule, DataListComponent],
  templateUrl: "./slider.component.html",
  host: {
    class: "w-full",
  },
})
export class SliderComponent {
  @Input({ required: true }) fieldName: string = "";
  @Input() min? = 0;
  @Input() max? = 10;
  @Input() step? = 1;
  @Input() stops?: number[] = [];

  @Input() accent?: boolean = false;

  keyPressedService = inject(KeyDetectorService);
  resolvedStep = computed(() => {
    const step = this.step ?? 1;
    if (!this.keyPressedService.controlPressed()) {
      return this.step;
    }
    const entero = Number.isInteger(step);
    if (entero) {
      return 1;
    }

    return step >= 2 ? 0.5 : 0.2;
  });

  protected get useTicks() {
    return this.stops?.length ?? 0 > 0;
  }

  get formGroup() {
    return this._parentFormGroupDirective?.control;
  }
  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}
}

