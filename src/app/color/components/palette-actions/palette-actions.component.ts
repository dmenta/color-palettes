import { Component, inject } from "@angular/core";
import { IconButtonDirective } from "../../../core/directives/icon-button.directive";
import { IconDirective } from "../../../core/directives/icon.directive";
import { ColorStateService } from "../../services/color-state.service";
import { PaletteStoreService } from "../../services/palette-store.service";
import { CopyService } from "../../services/copy.service";
import { Palette } from "../../model/palette.model";

@Component({
  selector: "zz-palette-actions",
  imports: [IconButtonDirective, IconDirective],
  templateUrl: "./palette-actions.component.html",
})
export class PaletteActionsComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);
  copyService = inject(CopyService);

  lock() {
    this.store.lockPalette(this.state.currentPaletteInfo());
  }

  unlock() {
    this.store.unlockPalette();
  }

  copy() {
    const valores = this.paletteValues(this.state.palette());
    this.copyService.copy(valores, "Palette colors copied!");
  }

  private paletteValues(palette: Palette) {
    const colores = palette.swatches.map((swatch) => swatch.color).join("\r\n");

    if (colores?.startsWith("rgb")) {
      return colores;
    } else {
      const coloresRgb = palette.swatches.map((swatch) => swatch.rgb).join("\r\n");

      return `${colores}\r\n\r\n${coloresRgb}`;
    }
  }
}
