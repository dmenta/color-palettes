import { effect, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DarkModeService {
  readonly darkMode = signal(false);

  setDarkMode(darkMode: boolean) {
    this.darkMode.set(darkMode);
  }
  constructor() {
    effect(() => this.apply(this.darkMode()));
  }
  private apply(darkMode: boolean) {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.querySelector("meta[name='color-scheme']")?.setAttribute("content", darkMode ? "dark" : "light");
  }
}
