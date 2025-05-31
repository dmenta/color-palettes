import { Component, Input, Optional } from "@angular/core";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-toggle-check",
  imports: [ReactiveFormsModule],
  templateUrl: "./toggle-check.component.html",
})
export class ToggleCheckComponent {
  @Input({ required: true }) fieldName: string = "";
  @Input() defaultValue?: boolean = false;
  @Input() label: string = "";

  get formGroup() {
    return this._parentFormGroupDirective?.control;
  }
  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}
}
