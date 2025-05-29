import { Component, input } from "@angular/core";

@Component({
  selector: "app-field-label",
  templateUrl: "./field-label.component.html",
})
export class FieldLabelComponent {
  readonly for = input<string | null | undefined>();
  readonly length = input<number | null | undefined>(undefined);
  readonly text = input(undefined, { transform: (value?: string) => value?.trim() ?? "" });
}
