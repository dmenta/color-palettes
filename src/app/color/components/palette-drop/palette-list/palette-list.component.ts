import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  NO_ERRORS_SCHEMA,
  output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { MiniPaletteComponent } from "../mini-palette/mini-palette.component";
import { PaletteInfo } from "../../../model/palette.model";

@Component({
  selector: "zz-palette-list",
  imports: [MiniPaletteComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: "./palette-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteListComponent {
  focusedIndex = 0;
  @ViewChildren("item") items!: QueryList<ElementRef>;

  active = input(false);

  palettes = input<PaletteInfo[]>([]);

  paletteSelected = output<PaletteInfo>();
  paletteRemoved = output<number>();

  @HostListener("document:keydown.arrowdown", ["$event"])
  handleDownEvent(_event: KeyboardEvent) {
    this.focusedIndex = Math.min(this.focusedIndex + 1, this.items.length - 1);
    this.focusItem();
  }
  @HostListener("document:keydown.arrowup", ["$event"])
  handleUpEvent(_event: KeyboardEvent) {
    this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
    this.focusItem();
  }

  constructor() {
    effect(() => {
      if (this.active()) {
        this.focusedIndex = 0;
        this.focusItem();
      }
    });
  }

  paletteClick(info: PaletteInfo) {
    this.paletteSelected.emit(info);
  }
  removePalette(event: MouseEvent, index: number) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    this.paletteRemoved.emit(index);
  }

  private focusItem() {
    setTimeout(() => {
      this.items.toArray()[this.focusedIndex]!.nativeElement.focus();
    }, 100);
  }
}
