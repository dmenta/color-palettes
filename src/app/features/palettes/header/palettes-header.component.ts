import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DarkModeToggleComponent } from "../../../core/components/dark-mode-toggle/dark-mode-toggle.component";

@Component({
  selector: "zz-palettes-header",
  imports: [DarkModeToggleComponent],
  templateUrl: "./palettes-header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettesHeaderComponent {}
