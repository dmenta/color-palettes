import { Component, inject } from "@angular/core";
import { IconButtonDirective } from "../../../core/directives/icon-button.directive";
import { IconDirective } from "../../../core/directives/icon.directive";
import { ColorStateService } from "../../services/color-state.service";
import { PaletteStoreService } from "../../services/palette-store.service";

@Component({
  selector: "zz-save-palette",
  imports: [IconButtonDirective, IconDirective],
  templateUrl: "./save-palette.component.html",
})
export class SavePaletteComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);
  lock() {
    this.store.lockPalette(this.state.palette());
  }

  unlock() {
    this.store.unlockPalette();
  }
}
