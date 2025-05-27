import { Component, computed, input } from "@angular/core";

@Component({
  selector: "app-field-value",
  template: `
    <div class="flex flex-row justify-end" [style.minWidth.ch]="length()">
      <span class="field-value-number">
        {{ displayValue() }}
      </span>
      <span class="field-value-suffix">
        @if(showSuffix()){
        {{ suffix() }}
        }</span
      >
    </div>
  `,
})
export class FieldValueComponent {
  readonly value = input.required<number | null | undefined>();
  readonly suffix = input(undefined, { transform: (value?: string) => value?.trim() ?? "" });
  readonly length = input<number | null | undefined>(undefined);
  readonly nullValueText = input("", { transform: (value?: string) => value?.trim() ?? "" });

  protected readonly displayValue = computed(() => this.value()?.toString() ?? this.nullValueText());
  protected readonly showSuffix = computed(() => this.value());
}
