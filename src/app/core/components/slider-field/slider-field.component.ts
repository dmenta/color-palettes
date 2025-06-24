import { Component, input, Input, Optional } from "@angular/core";
import { FieldValueComponent } from "./field-value.component";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { SliderSlimDirective } from "../slider/slider.directive";
import { TextLengthDirective } from "../../directives/text-length.directive";
import { DataListComponent } from "../slider/data-list.component";
import { OverflowVisibleDirective } from "../../directives/overflow.directive";
import { WidthFullDirective } from "../../directives/width.directive";

@Component({
  selector: "zz-slider-field",
  imports: [
    ReactiveFormsModule,
    SliderSlimDirective,
    FieldValueComponent,
    TextLengthDirective,
    DataListComponent,
    OverflowVisibleDirective,
  ],
  templateUrl: "./slider-field.component.html",
  hostDirectives: [WidthFullDirective],
})
export class SliderFieldComponent {
  @Input({ required: true }) fieldName: string = "";
  @Input("labels-above") labelsAbove = true;
  @Input("labels-reverse") labelsReverse = false;
  @Input() label: string = "";
  @Input() valueLength?: number;
  @Input() unit?: string = "";

  showTrack = input(true);

  @Input() min?: number = 0;
  @Input() max?: number = 10;
  @Input() step?: number = 1;
  @Input() stops?: number[] = [];
  @Input() labelLength?: number;

  private _defaultValue: number = 0;
  @Input()
  get defaultValue() {
    return this._defaultValue;
  }
  set defaultValue(value: number) {
    this._defaultValue = value;
  }

  private _showLabel: boolean = false;

  @Input() get showLabel() {
    return this._showLabel && (this.labelLength ?? 1) > 0;
  }
  set showLabel(value: boolean) {
    this._showLabel = value;
  }

  private _showValue: boolean = false;

  @Input() get showValue() {
    return this._showValue && (this.valueLength ?? 1) > 0;
  }
  set showValue(value: boolean) {
    this._showValue = value;
  }

  get decimales() {
    let decimales = 0;
    if ((this.step ?? 1) !== 1 && !Number.isInteger(this.step)) {
      const stepStr = this.step!.toString();
      decimales = stepStr.split(".")[1].length;
    }
    if ((this.min ?? 0) !== 0 && !Number.isInteger(this.min)) {
      const minStr = this.min!.toString();
      decimales = Math.max(decimales, minStr.split(".")[1].length);
    }

    if ((this.max ?? 10) !== 10 && !Number.isInteger(this.max)) {
      const maxStr = this.max!.toString();
      decimales = Math.max(decimales, maxStr.split(".")[1].length);
    }

    return decimales;
  }

  get formGroup() {
    return this._parentFormGroupDirective?.control;
  }
  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}
}
