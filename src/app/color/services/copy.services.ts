import { inject, Injectable, signal } from "@angular/core";
import { ColorStateService } from "./color-state.service";
import { namedColorModels } from "../model/color-models-definitions";

@Injectable({
  providedIn: "root",
})
export class CopyService {
  state = inject(ColorStateService);

  copyNotification = signal(false);
  lastTimeoutId: number | undefined = undefined;

  abort: AbortController | undefined = undefined;

  copyCurrentPalette() {
    const colores = this.state
      .palette()
      .swatches.map((swatch) => this.state.colorModel().convert(swatch.valores))
      .join("\r\n");

    if (this.state.colorModel().name === "rgb") {
      navigator.clipboard.writeText(colores);
    } else {
      const coloresRgb = this.state
        .palette()
        .swatches.map((swatch) => namedColorModels["rgb"].convert(swatch.color))
        .join("\r\n");

      navigator.clipboard.writeText(`${colores}\r\n\r\n${coloresRgb}`);
    }

    this.setCopyNotification(true);
  }

  setCopyNotification(show: boolean) {
    this.copyNotification.set(show);

    this.abort?.abort();

    if (this.copyNotification()) {
      this.abort = new AbortController();
      const abortar = this.abort.signal;

      window.addEventListener("keydown", this.onKeyDown.bind(this), { once: true, signal: abortar, capture: true });
      window.addEventListener("click", this.onClick.bind(this), { once: true, signal: abortar, capture: true });

      this.setHideTimeout();
    } else {
      this.clearHideTimeout();
    }
  }

  setHideTimeout() {
    this.clearHideTimeout();
    this.lastTimeoutId = window.setTimeout(() => {
      this.setCopyNotification(false);
    }, 2500);
  }
  clearHideTimeout() {
    if (this.lastTimeoutId) {
      clearTimeout(this.lastTimeoutId);
      this.lastTimeoutId = undefined;
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.setCopyNotification(false);
    }
  }
  onClick(_event: MouseEvent) {
    this.setCopyNotification(false);
  }

  ngOnDestroy() {
    this.abort?.abort();
  }
}
