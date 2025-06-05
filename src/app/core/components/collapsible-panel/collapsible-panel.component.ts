import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { IconDirective } from "../icon/icon.directive";
import { FocusRingDirective } from "../../directives/focus-ring.directive";
import { PanelDirective } from "../../directives/containers/panel.directive";
import { CollapseVerticalDirective } from "../../directives/collapse-vertical.directive";
import { SelectNoneDirective, WidthFullDirective } from "../../directives/appearance-none.directive";

@Component({
  selector: "zz-collapsible-panel",
  imports: [CollapseVerticalDirective, SelectNoneDirective, WidthFullDirective, IconDirective, FocusRingDirective],
  template: ` <div
      (click)="expandCollapse($event)"
      class="flex flex-row items-center justify-left gap-1 py-2 pr-4 cursor-pointer
      hover:bg-gray-300/10 dark:hover:bg-white/10 transition-colors duration-200">
      <button zz-focus-ring type="button">
        <span zz-icon [class.rotate-90]="!collapsed()">chevron_right</span>
      </button>
      <div zz-select-none zz-width-full>
        <ng-content select="[header]">Header</ng-content>
      </div>
    </div>
    <div [zz-collapse-vertical]="collapsed()">
      <div class="px-4 py-4 border-t-1 border-black/20 dark:border-white/10 ">
        <ng-content></ng-content>
      </div>
    </div>`,
  hostDirectives: [PanelDirective, FocusRingDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsiblePanelComponent {
  collapsed = signal(false);

  expandCollapse(event: MouseEvent) {
    this.collapsed.update((current) => !current);
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
