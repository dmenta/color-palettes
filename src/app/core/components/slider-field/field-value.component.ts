import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TransitionDefaultDirective } from "../../directives/transition.directive";
import { SelectNoneDirective } from "../../directives/user-select.directive";

@Component({
  selector: "zz-field-value",
  imports: [DecimalPipe],
  templateUrl: "./field-value.component.html",
  hostDirectives: [TransitionDefaultDirective, SelectNoneDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
