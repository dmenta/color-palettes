import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class KeyDetectorService {
  controlPressed = signal(false);

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }
  private handleKeyDown(event: KeyboardEvent): void {
    this.controlPressed.set(event.ctrlKey);
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.controlPressed.set(event.ctrlKey);
  }
}
