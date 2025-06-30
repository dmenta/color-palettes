import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DarkModeToggleComponent } from "../../../core/components/dark-mode-toggle/dark-mode-toggle.component";
import { PaletteSelectorComponent } from "../../../color/components/palette-selector/palette-selector.component";
import { MarcaComponent } from "../../../core/components/marca/marca.component";

@Component({
  selector: "zz-palettes-header",
  imports: [DarkModeToggleComponent, PaletteSelectorComponent, MarcaComponent],
  templateUrl: "./palettes-header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettesHeaderComponent {}
