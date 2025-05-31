import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-field-value",
  imports: [DecimalPipe],
  templateUrl: "./field-value.component.html",
})
export class FieldValueComponent {
  @Input({ required: true }) value: number | null = null;
  @Input() unit?: string;
  @Input() length?: number | null;
  @Input() nullValueText?: string = "";

  @Input() decimals?: number = 0;

  protected get showUnit() {
    return (this.unit?.length ?? 0) > 0;
  }
}
