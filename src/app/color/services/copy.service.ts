import { inject, Injectable } from "@angular/core";
import { ColorStateService } from "./color-state.service";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class CopyService {
  private state = inject(ColorStateService);

  private notificationService = inject(NotificationService);

  copy(value: string, message?: string) {
    navigator.clipboard.writeText(value);
    this.notificationService.notify(message ?? "Copied to clipboard!");
  }

  copyCurrentPalette() {
    const colores = this.state
      .palette()
      .swatches.map((swatch) => swatch.color)
      .join("\r\n");

    if (this.state.colorModel().name === "rgb") {
      navigator.clipboard.writeText(colores);
    } else {
      const coloresRgb = this.state
        .palette()
        .swatches.map((swatch) => swatch.rgb)
        .join("\r\n");

      navigator.clipboard.writeText(`${colores}\r\n\r\n${coloresRgb}`);
    }

    this.notificationService.notify("Palette colors copied!");
  }
}
