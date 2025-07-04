import { ChangeDetectionStrategy, Component, HostListener, inject } from "@angular/core";
import { ColorStateService } from "../../services/color-state.service";
import { PaletteStoreService } from "../../services/palette-store.service";
import { CopyService } from "../../../core/service/copy.service";
import { Palette } from "../../model/palette.model";
import { rgbToHex } from "../../model/color";

@Component({
  selector: "zz-palette-actions",
  templateUrl: "./palette-actions.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteActionsComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);
  copyService = inject(CopyService);

  @HostListener("document:keydown.control.shift.c", ["$event"])
  handleCopyShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.copy();
  }

  @HostListener("document:keydown.control.shift.s", ["$event"])
  handleSaveShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.save();
  }

  @HostListener("document:keydown.control.shift.k", ["$event"])
  handleLockShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.lock();
  }

  @HostListener("document:keydown.control.shift.u", ["$event"])
  handleUnlockShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.unlock();
  }

  save() {
    this.store.save(this.state.currentPaletteInfo());
  }

  lock() {
    this.store.lock(this.state.currentPaletteInfo());
  }

  unlock() {
    this.store.unlock();
  }

  copy() {
    const valores = this.paletteValues(this.state.palette());
    this.copyService.copy(valores, "Palette colors copied!");
  }

  private paletteValues(palette: Palette) {
    const rgbParts = [] as string[];
    const hexParts = [] as string[];
    const colorParts = [] as string[];
    for (const swatch of palette.swatches) {
      rgbParts.push(swatch.rgb);
      hexParts.push(rgbToHex(swatch.rgbValues));
      colorParts.push(swatch.color);
    }
    const colors = colorParts.join("\r\n");
    const hexs = hexParts.join("\r\n");

    if (colors?.startsWith("rgb")) {
      return `${colors}\r\n\r\n${hexs}`;
    } else {
      const rgbs = rgbParts.join("\r\n");

      return `${colors}\r\n\r\n${rgbs}\r\n\r\n${hexs}`;
    }
  }
}
