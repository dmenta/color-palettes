import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { PaletteInfo } from "../model/colors.model";

@Injectable({
  providedIn: "root",
})
export class PaletteStoreService {
  store = inject(StorageService);

  saved = signal<PaletteInfo[]>(this.store.get<PaletteInfo[]>("saved-palettes") ?? []);

  lockedPalette = signal<PaletteInfo | undefined>(this.store.get<PaletteInfo>("locked-palette") ?? undefined);

  lockPalette(paletteInfo: PaletteInfo) {
    const current = this.lockedPalette();
    if (current && this.paletteEquals(current, paletteInfo)) {
      return;
    }
    this.store.save("locked-palette", paletteInfo);
    this.lockedPalette.set(paletteInfo);

    const saved = this.saved();
    if (saved.length > 0 && this.paletteEquals(saved[0]!, paletteInfo)) {
      return;
    }
    this.saved.update((palettes) => [paletteInfo, ...palettes].slice(0, 10));
    this.store.save("saved-palettes", this.saved());
  }
  unlockPalette() {
    this.store.delete("locked-palette");
    this.lockedPalette.set(undefined);
  }
  removePalette(index: number) {
    this.saved.update((palettes) => {
      const newPalettes = [...palettes];
      newPalettes.splice(index, 1);
      return newPalettes;
    });

    this.store.save("saved-palettes", this.saved());
  }

  paletteEquals(current: PaletteInfo, next: PaletteInfo) {
    if (current.palette.model !== next.palette.model) {
      return false;
    }
    if (current.state.variableConfig.variable.name !== next.state.variableConfig.variable.name) {
      return false;
    }
    const precision = current.state.variableConfig.variable.precision;
    if (
      current.state.minmax[0].toFixed(precision) !== next.state.minmax[0].toFixed(precision) ||
      current.state.minmax[1].toFixed(precision) !== next.state.minmax[1].toFixed(precision)
    ) {
      return false;
    }

    if (current.palette.swatches.length !== next.palette.swatches.length) {
      return false;
    }
    for (let i = 0; i < current.palette.swatches.length; i++) {
      if (current.palette.swatches[i]?.valores[0] !== next.palette.swatches[i]?.valores[0]) {
        return false;
      }
      if (current.palette.swatches[i]?.valores[1] !== next.palette.swatches[i]?.valores[1]) {
        return false;
      }
      if (current.palette.swatches[i]?.valores[2] !== next.palette.swatches[i]?.valores[2]) {
        return false;
      }
    }

    return true;
  }
}
