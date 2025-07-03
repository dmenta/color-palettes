import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SelectNoneDirective } from "../../directives/user-select.directive";

@Component({
  selector: "zz-field-value",
  templateUrl: "./field-value.component.html",
  hostDirectives: [SelectNoneDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldValueComponent {
  @Input({ required: true }) value: number | null = null;
  @Input() unit?: string = "";
  @Input() length?: number | null;
  @Input() nullValueText?: string = "";

  @Input() decimals?: number = 0;

  get text() {
    if (this.value === null) {
      return this.nullValueText ?? "N/A";
    }
    return this.value.toFixed(this.decimals ?? 0) + (this.unit ?? "");
  }
}
