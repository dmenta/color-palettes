import { Component, input, output, model } from "@angular/core";
import { IconButtonComponent } from "./icon-button.component";

@Component({
  selector: "app-icon-toggle-button",
  imports: [IconButtonComponent],
  template: `
    <app-icon-button [disabled]="disabled()" (click)="onToggle($event)">
      {{ value() ? trueIcon() : falseIcon() }}
    </app-icon-button>
  `,
})
export class IconToggleButtonComponent {
  disabled = input<boolean>();
  value = model<boolean>(true);
  toggle = output<boolean>();

  trueIcon = input<string>("radio_button_checked");
  falseIcon = input<string>("radio_button_unchecked");

  onToggle(event: MouseEvent) {
    this.value.update((currentValue) => !currentValue);
    this.toggle.emit(this.value());
    event.stopPropagation();
  }
}
