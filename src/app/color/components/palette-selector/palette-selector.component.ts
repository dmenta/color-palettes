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

  open = signal(false);
  toggleOpen() {
    this.open.update((value) => !value);
    if (this.open()) {
      window.addEventListener("keydown", this.onKeyDown.bind(this));
      window.addEventListener("click", this.onClick.bind(this));
    } else {
      window.removeEventListener("click", this.onClick);
      window.removeEventListener("keydown", this.onKeyDown);
    }
  }
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.open.set(false);
      event.stopPropagation();
    }
  }

  onClick(event: MouseEvent) {
    this.open.set(false);
    event.stopPropagation();
  }
}
