import { Component, input, NO_ERRORS_SCHEMA, output } from "@angular/core";
import { MiniPaletteComponent } from "../mini-palette/mini-palette.component";
import { PaletteInfo } from "../../model/colors.model";

@Component({
  selector: "zz-palette-list",
  imports: [MiniPaletteComponent],
  schemas: [NO_ERRORS_SCHEMA],

  templateUrl: "./palette-list.component.html",
})
export class PaletteListComponent {
  palettes = input<PaletteInfo[]>([]);

  paletteSelected = output<PaletteInfo>();

  paletteRemoved = output<number>();

  paletteClick(info: PaletteInfo) {
    this.paletteSelected.emit(info);
  }
  removePalette(event: MouseEvent, index: number) {
    event.stopPropagation();
    event.preventDefault();
    this.paletteRemoved.emit(index);
  }
}
