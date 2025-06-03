import { Component, model, output } from "@angular/core";
import { IconButtonDirective } from "./icon-button.directive";
import { IconDirective } from "../icon/icon.directive";

@Component({
  selector: "button[app-icon-toggle-button]",
  imports: [IconDirective, IconButtonDirective],
  template: `
    @if(value()) {
    <ng-content select="[trueicon]"><span app-icon>radio_button_checked</span></ng-content>
    } @else {
    <ng-content select="[falseicon]"><span app-icon>radio_button_unchecked</span></ng-content>
    }
  `,
  host: {
    "(click)": "onClick($event)",
  },
  hostDirectives: [IconButtonDirective],
})
export class IconToggleButtonComponent {
  value = model<boolean>(true);
  toggle = output<boolean>();

  onClick(event: MouseEvent) {
    this.value.update((currentValue) => !currentValue);
    this.toggle.emit(this.value());
    event.stopPropagation();
  }
}
