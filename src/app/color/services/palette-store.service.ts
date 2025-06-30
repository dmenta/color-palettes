import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { Palette } from "../model/colors.model";

@Injectable({
  providedIn: "root",
})
export class PaletteStoreService {
  store = inject(StorageService);

  lockedPalette = signal<Palette | undefined>(this.store.get<Palette>("locked-palette") ?? undefined);

  lockPalette(palette: Palette) {
    this.store.save("locked-palette", palette);
    this.lockedPalette.set(palette);
  }
  unlockPalette() {
    this.store.delete("locked-palette");
    this.lockedPalette.set(undefined);
  }
}
