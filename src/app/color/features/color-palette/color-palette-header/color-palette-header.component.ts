import { Component } from "@angular/core";
import { DarkModeToggleComponent } from "../../../../core/components/dark-mode-toggle/dark-mode-toggle.component";

@Component({
  selector: "zz-color-palette-header",
  imports: [DarkModeToggleComponent],
  templateUrl: "./color-palette-header.component.html",
})
export class ColorPaletteHeaderComponent {}
