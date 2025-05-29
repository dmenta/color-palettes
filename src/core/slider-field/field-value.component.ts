import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-field-value",
  templateUrl: "./field-value.component.html",
})
export class FieldValueComponent {
  readonly value = input.required<number | null | undefined>();
  readonly unit = input(undefined, { transform: (value?: string) => value?.trim() ?? "" });
  readonly length = input<number | null | undefined>(undefined);
  readonly nullValueText = input("", { transform: (value?: string) => value?.trim() ?? "" });

  protected readonly displayValue = computed(() => this.value()?.toString() ?? this.nullValueText());
  protected readonly showUnit = computed(() => this.value());
}
