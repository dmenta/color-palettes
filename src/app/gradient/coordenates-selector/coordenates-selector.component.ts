import { Component, effect, input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SliderFieldComponent } from "../../core/components/slider-field/slider-field.component";
import { map } from "rxjs";
import { Coordenates } from "../models/bezier-curve";

@Component({
  selector: "zz-coordenates-selector",
  imports: [ReactiveFormsModule, SliderFieldComponent],
  templateUrl: "./coordenates-selector.component.html",
})
export class BezierCoordenatesSelectorComponent {
  coords = input<Coordenates>({
    point1: { x: 50, y: 50 },
    point2: { x: 50, y: 50 },
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
        point1: { x: x1 ?? 0, y: y1 ?? 0 },
        point2: { x: x2 ?? 0, y: y2 ?? 0 },
      };

      return coords;
    })
  );

  constructor() {
    effect(() => {
      const coords = this.coords();
      this.coordenadasGroup.patchValue(
        { x1: coords.point1.x, y1: coords.point1.y, x2: coords.point2.x, y2: coords.point2.y },
        { emitEvent: true }
      );
    });
  }
}
