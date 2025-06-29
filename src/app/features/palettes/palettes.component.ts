import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PalettesHeaderComponent } from "./header/palettes-header.component";
import { ColorMenuComponent } from "../../color/components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../color/components/color-sample/color-sample.component";
import { ColorRangeSelectorComponent } from "../../color/components/color-range-selector/color-range-selector.component";
import { ColorAxisAdvancedConfigComponent } from "../../color/components/axis-advanced-config/axis-advanced-config.component";
import { ColorStateService } from "../../color/services/color-state.service";
import { ColorPaletteComponent } from "../../color/components/color-palette/color-palette.component";

@Component({
  selector: "zz-palettes",
  imports: [
    PalettesHeaderComponent,
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisAdvancedConfigComponent,
    ColorPaletteComponent,
  ],
  templateUrl: "./palettes.component.html",
  host: {
    styles: "display: block;  height: 100vh;  width: 100vw;  overflow-x: hidden;",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettesComponent {
  state = inject(ColorStateService);
}
