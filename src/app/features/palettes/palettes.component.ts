import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PalettesHeaderComponent } from "./header/palettes-header.component";
import { ColorMenuComponent } from "../../color/components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../color/components/color-sample/color-sample.component";
import { ColorRangeSelectorComponent } from "../../color/components/color-range-selector/color-range-selector.component";
import { ColorStateService } from "../../color/services/color-state.service";
import { ColorPaletteComponent } from "../../color/components/color-palette/color-palette.component";
import { PaletteStepsConfigComponent } from "../../color/components/palette-steps-config/palette-steps-config.component";
import { PaletteVisualConfigComponent } from "../../color/components/palette-visual-config/palette-visual-config.component";
import { PaletteValuesConfigComponent } from "../../color/components/palette-values-config/palette-values-config.component";
import { PaletteStoreService } from "../../color/services/palette-store.service";
import { PaletteActionsComponent } from "../../color/components/palette-actions/palette-actions.component";
import { NotificationComponent } from "../../color/components/notification/notification.component";

@Component({
  selector: "zz-palettes",
  imports: [
    PalettesHeaderComponent,
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    PaletteStepsConfigComponent,
    PaletteVisualConfigComponent,
    PaletteValuesConfigComponent,
    ColorPaletteComponent,
    PaletteActionsComponent,
    NotificationComponent,
  ],
  templateUrl: "./palettes.component.html",
  host: {
    styles: "display: block;  height: 100vh;  width: 100vw;  overflow-x: hidden;",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettesComponent {
  state = inject(ColorStateService);
  store = inject(PaletteStoreService);
}
