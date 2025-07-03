import { Component } from "@angular/core";
import { PaletteActionsComponent } from "../palette-actions/palette-actions.component";
import { PaletteStepsConfigComponent } from "../palette-config/palette-steps-config/palette-steps-config.component";
import { PaletteValuesConfigComponent } from "../palette-config/palette-values-config/palette-values-config.component";
import { PaletteVisualConfigComponent } from "../palette-config/palette-visual-config/palette-visual-config.component";

@Component({
  selector: "zz-palette-menu",
  imports: [
    PaletteStepsConfigComponent,
    PaletteVisualConfigComponent,
    PaletteValuesConfigComponent,
    PaletteActionsComponent,
  ],
  templateUrl: "./palette-menu.component.html",
})
export class PaletteMenuComponent {}
