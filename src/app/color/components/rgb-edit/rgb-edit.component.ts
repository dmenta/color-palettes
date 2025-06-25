import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputDirective } from "../../../core/directives/input.directive";

@Component({
  selector: "zz-rgb-edit",
  imports: [ReactiveFormsModule, InputDirective],
  templateUrl: "./rgb-edit.component.html",
})
export class RgbEditComponent {
  rgbColor: FormGroup<{ R: FormControl<number>; G: FormControl<number>; B: FormControl<number> }>;

  ngOnInit() {
    this.rgbColor = new FormGroup({
      R: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
      G: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
      B: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
    });
  }
}
