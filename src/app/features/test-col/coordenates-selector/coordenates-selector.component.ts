import { Component, effect, input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { map } from "rxjs";
import { Coordenates } from "../bezier-curve";

@Component({
  selector: "zz-coordenates-selector",
  imports: [ReactiveFormsModule, SliderFieldComponent],
  templateUrl: "./coordenates-selector.component.html",
})
export class CoordenatesSelectorComponent {
  coords = input<Coordenates>({
    x1: 50,
    y1: 50,
    x2: 50,
    y2: 50,
  });
  coordenadasGroup: FormGroup<{
    x1: FormControl<number>;
    y1: FormControl<number>;
    x2: FormControl<number>;
    y2: FormControl<number>;
  }> = new FormGroup({
    x1: new FormControl(50, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
    y1: new FormControl(50, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
    x2: new FormControl(50, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
    y2: new FormControl(50, { nonNullable: true, validators: [Validators.min(0), Validators.max(100)] }),
  });

  @Output() coordsChanged = this.coordenadasGroup.valueChanges.pipe(
    map((values) => {
      const { x1, y1, x2, y2 } = values;
      const coords: Coordenates = {
        x1: x1 ?? 0,
        y1: y1 ?? 0,
        x2: x2 ?? 0,
        y2: y2 ?? 0,
      };

      return coords;
    })
  );

  constructor() {
    effect(() => this.coordenadasGroup.patchValue(this.coords(), { emitEvent: true }));
  }
}
