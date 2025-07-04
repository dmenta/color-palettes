import { ChangeDetectionStrategy, Component, computed, input, Input } from "@angular/core";

@Component({
  selector: "[zz-field-value]",
  templateUrl: "./field-value.component.html",
  host: {
    class: "select-none",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldValueComponent {
  value = input<number | null>(null);
  @Input() unit?: string = "";
  @Input() length?: number | null;
  @Input() nullValueText?: string = "";

  @Input() decimals?: number = 0;

  text = computed(() => {
    const value = this.value();
    if (value === null) {
      return this.nullValueText ?? "N/A";
    }
    return value.toFixed(this.decimals ?? 0) + (this.unit ?? "");
  });
}
