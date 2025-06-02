import { Component, input } from "@angular/core";

@Component({
  selector: "app-show-hide",
  template: `
    <div
      [style.height]="show() ? 'calc-size(auto, size)' : '0'"
      [class.opacity-50]="!show()"
      class="transition-all  duration-100 overflow-y-hidden ease-in block">
      <ng-content></ng-content>
    </div>
  `,
})
export class ShowHideComponent {
  show = input(true);
}
