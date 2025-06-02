import { Component, signal } from "@angular/core";
import { ShowHideComponent } from "./../show-hide/show-hide.component";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "app-collapsible-panel",
  imports: [ShowHideComponent, IconComponent],
  template: `<div
    class="border-1  rounded-md border-black/10 dark:border-white/10 dark:bg-gray-800/50 bg-gray-300/5 shadow-md/10 shadow-gray-500">
    <div
      (click)="expandCollapse($event)"
      class="flex flex-row items-center justify-left cursor-pointer gap-1
      
       hover:bg-gray-300/10 dark:hover:bg-white/10 transition-colors duration-200  py-2 pr-4">
      <button type="button" class="px-2">
        <app-icon
          class="text-gray-600 dark:text-gray-300 block  transition-transform"
          [class.rotate-90]="!collapsed()"
          name="chevron_right" />
      </button>
      <div class="select-none w-full">
        <ng-content select="[header]">Header</ng-content>
      </div>
    </div>
    <app-show-hide [show]="!collapsed()">
      <div class="px-4 py-4 border-t-1 border-black/20 dark:border-white/10">
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
