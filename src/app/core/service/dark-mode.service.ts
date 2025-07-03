import { effect, inject, Injectable, signal } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class DarkModeService {
  store = inject(StorageService);
  readonly darkMode = signal((this.store.get("darkMode") as boolean) ?? this.darkModeSystem());

  setDarkMode(darkMode: boolean) {
    this.darkMode.set(darkMode);
  }
  constructor() {
    effect(() => this.apply(this.darkMode()));
  }
  private apply(darkMode: boolean) {
    this.store.save("darkMode", darkMode);

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.querySelector("meta[name='color-scheme']")?.setAttribute("content", darkMode ? "dark" : "light");
  }
  private darkModeSystem() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
}
