import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "../../core/service/storage.service";
import { NotificationService } from "./notification.service";
import { PaletteInfo, paletteInfoEquals } from "../model/palette.model";

@Injectable({
  providedIn: "root",
})
export class PaletteStoreService {
  store = inject(StorageService);
  notificationService = inject(NotificationService);

  saved = signal<PaletteInfo[]>(this.store.get<PaletteInfo[]>("saved-palettes") ?? []);

  lockedPalette = signal<PaletteInfo | undefined>(this.store.get<PaletteInfo>("locked-palette") ?? undefined);

  lock(paletteInfo: PaletteInfo) {
    const current = this.lockedPalette();
    if (current && paletteInfoEquals(current, paletteInfo)) {
      this.notificationService.warn("Already locked!");
      return;
    }

    this.store.save("locked-palette", paletteInfo);
    this.lockedPalette.set(paletteInfo);

    this.notificationService.success("Palette locked!");
  }

  unlock() {
    this.store.delete("locked-palette");
    this.lockedPalette.set(undefined);
  }
  remove(index: number) {
    this.saved.update((palettes) => {
      const newPalettes = [...palettes];
      newPalettes.splice(index, 1);
      return newPalettes;
    });

    this.store.save("saved-palettes", this.saved());
  }

  save(paletteInfo: PaletteInfo) {
    const indice = this.saved().findIndex((p) => paletteInfoEquals(p, paletteInfo));
    if (indice >= 0) {
      this.notificationService.warn(`Already saved at #${indice + 1}`);

      return;
    }

    this.saved.update((palettes) => [paletteInfo, ...palettes].slice(0, 10));
    this.store.save("saved-palettes", this.saved());

    this.notificationService.success("Palette saved!");
  }
}
