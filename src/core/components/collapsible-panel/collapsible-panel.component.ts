import { Component, signal } from "@angular/core";
import { ShowHideComponent } from "./../show-hide/show-hide.component";

@Component({
  selector: "app-collapsible-panel",
  imports: [ShowHideComponent],
  template: `<div
    class="border-1  rounded border-black/10 dark:border-white/10 dark:bg-gray-800/50 bg-gray-300/5 shadow-md/10 shadow-gray-500">
    <div
      (click)="expandCollapse($event)"
      class="select-none py-2 px-4  cursor-pointer hover:bg-gray-300/10 dark:hover:bg-white/10 transition-colors duration-200">
      <ng-content select="[header]">Header</ng-content>
    </div>
    <app-show-hide [show]="!collapsed()">
      <div class="px-4 py-4 border-t-1 dark:border-white/10">
        <ng-content>Hola</ng-content>
      </div>
    </app-show-hide>
  </div>`,
})
export class CollapsiblePanelComponent {
  expandCollapse(event: MouseEvent) {
    this.collapsed.update((current) => !current);

    event.preventDefault();
    event.stopPropagation();
  }

  collapsed = signal(false);
}
