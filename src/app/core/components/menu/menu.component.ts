import { Component, OnDestroy, Renderer2, signal } from "@angular/core";
import { DarkModeToggleComponent } from "../dark-mode-toggle/dark-mode-toggle.component";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "zz-menu",
  imports: [DarkModeToggleComponent, RouterLink, RouterLinkActive],
  templateUrl: "./menu.component.html",
})
export class MenuComponent implements OnDestroy {
  open = signal(false);

  private removeDocumentClickListenerFn: (() => void) | null = null;
  private removeDocumentEscapeListenerFn: (() => void) | null = null;

  constructor(private renderer: Renderer2) {
    this.setListeners();
  }

  toggleDropdown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (this.open()) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.open.set(true);
    this.setListeners();
  }
  private setListeners() {
    if (this.open()) {
      this.removeDocumentClickListenerFn = this.renderer.listen("document", "click", () => this.hide());
      this.removeDocumentEscapeListenerFn = this.renderer.listen("document", "keydown.escape", () => this.hide(), {
        passive: true,
      });
    }
  }

  private hide() {
    this.open.set(false);

    this.removeDocumentClickListenerFn?.();
    this.removeDocumentEscapeListenerFn?.();
  }

  onClick(_event: MouseEvent) {
    this.hide;
  }

  ngOnDestroy() {
    this.removeDocumentClickListenerFn?.();
    this.removeDocumentEscapeListenerFn?.();
  }
}
