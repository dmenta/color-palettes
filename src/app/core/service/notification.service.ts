import { Injectable, OnDestroy, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class NotificationService implements OnDestroy {
  showNotification = signal(false);
  notificationMessage = signal<{ type: "success" | "warn"; message?: string }>({ type: "success", message: "" });
  private lastTimeoutId: number | undefined = undefined;
  private abort: AbortController | undefined = undefined;

  success(message?: string) {
    this.notificationMessage.set({ type: "success", message: message ?? "" });
    this.setNotification(true);
  }

  warn(message?: string) {
    this.notificationMessage.set({ type: "warn", message: message ?? "" });
    this.setNotification(true);
  }

  private setNotification(show: boolean) {
    this.showNotification.set(show);

    this.abort?.abort();

    if (this.showNotification()) {
      this.abort = new AbortController();
      const abortar = this.abort.signal;

      window.addEventListener("keydown", this.onKeyDown.bind(this), { once: true, signal: abortar, capture: true });
      window.addEventListener("click", this.onClick.bind(this), { once: true, signal: abortar, capture: true });

      this.setHideTimeout();
    } else {
      this.clearHideTimeout();
    }
  }

  private setHideTimeout() {
    this.clearHideTimeout();
    this.lastTimeoutId = window.setTimeout(() => {
      this.setNotification(false);
    }, 1500);
  }
  private clearHideTimeout() {
    if (this.lastTimeoutId) {
      clearTimeout(this.lastTimeoutId);
      this.lastTimeoutId = undefined;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      this.setNotification(false);
    }
  }
  private onClick(_event: MouseEvent) {
    this.setNotification(false);
  }

  ngOnDestroy() {
    this.abort?.abort();
  }
}
