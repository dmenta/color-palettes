import { ChangeDetectionStrategy, Component, effect, HostListener, inject, signal } from "@angular/core";
import { PaletteListComponent } from "../palette-list/palette-list.component";
import { PaletteStoreService } from "../../../services/palette-store.service";
import { ColorStateService } from "../../../services/color-state.service";

@Component({
  selector: "zz-palette-selector",
  imports: [PaletteListComponent],
  templateUrl: "./palette-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteSelectorComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);

  abort: AbortController | undefined = undefined;
  open = signal(false);

  @HostListener("document:keydown.control.k", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.preventDefault();
    this.openState(!this.open());
  }

  @HostListener("document:keydown.escape", ["$event"])
  handleEscapeEvent(_event: KeyboardEvent) {
    this.openState(false);
  }

  constructor() {
    effect(() => {
      if (this.store.saved().length === 0) {
        this.openState(false);
      }
    });
  }

  toggleOpen(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.openState(!this.open());
  }
  openState(open: boolean) {
    this.abort?.abort();

    this.open.set(open);

    if (this.open()) {
      this.abort = new AbortController();
      const abortar = this.abort.signal;
      window.addEventListener("click", this.onClick.bind(this), { once: true, signal: abortar });
    }
  }

  onClick(_event: MouseEvent) {
    this.openState(false);
  }

  ngOnDestroy() {
    this.abort?.abort();
  }
}
