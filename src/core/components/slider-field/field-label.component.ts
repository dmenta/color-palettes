import { Component, Input } from "@angular/core";

@Component({
  selector: "app-field-label",
  templateUrl: "./field-label.component.html",
})
export class FieldLabelComponent {
  @Input() for?: string | null;
  @Input() length?: number | null;
  @Input() text: string = "";
  @Input() classes: string = "";
}
