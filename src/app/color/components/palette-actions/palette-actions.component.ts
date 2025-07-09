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
  private readonly baseDate = new Date(2025, 0, 1).valueOf();

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

  saveSVG() {
    this.paletteToSVG(this.state.palette().swatches.map((s) => s.rgb));
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

  private paletteToSVG(rgbColors: string[], size: number = 40) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${rgbColors.length * size}" height="50">
      <rect width="100%" height="100%" fill="white"/>
      ${rgbColors
        .map((color, index) => `<rect x="${index * size}" y="0" width="${size}" height="${size}" fill="${color}"/>`)
        .join("\n")}
    </svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `colorina-palette-${new Date().valueOf() - this.baseDate}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
