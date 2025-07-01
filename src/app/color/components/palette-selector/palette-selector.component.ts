import { Component, inject, signal } from "@angular/core";
import { BaseButtonDirective } from "../../../core/directives/button.directive";
import { PaletteListComponent } from "../palette-list/palette-list.component";
import { PaletteStoreService } from "../../services/palette-store.service";
import { ColorStateService } from "../../services/color-state.service";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { BorderDirective } from "../../../core/directives/border.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";

@Component({
  selector: "zz-palette-selector",
  imports: [BaseButtonDirective, PaletteListComponent, CollapseVerticalDirective, BorderDirective, ShadowDirective],
  templateUrl: "./palette-selector.component.html",
})
export class PaletteSelectorComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);

  abort: AbortController | undefined = undefined;
  open = signal(false);
  toggleOpen() {
    this.openState(!this.open());
  }
  openState(open: boolean) {
    this.abort?.abort();

    this.open.set(open);

    if (this.open()) {
      this.abort = new AbortController();
      const abortar = this.abort.signal;
      window.addEventListener("keydown", this.onKeyDown.bind(this), { once: true, signal: abortar, capture: true });
      window.addEventListener("click", this.onClick.bind(this), { once: true, signal: abortar });
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.openState(false);
    }
  }

  onClick(_event: MouseEvent) {
    this.openState(false);
  }

  ngOnDestroy() {
    this.abort?.abort();
  }
}
