import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ColorMenuComponent } from "../../color/components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../color/components/color-sample/color-sample.component";
import { ColorRangeSelectorComponent } from "../../color/components/color-range-selector/color-range-selector.component";
import { ColorStateService } from "../../color/services/color-state.service";
import { ColorPaletteComponent } from "../../color/components/color-palette/color-palette.component";
import { PaletteStoreService } from "../../color/services/palette-store.service";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { PaletteMenuComponent } from "../../color/components/palette-menu/palette-menu.component";
import { PaletteSelectorComponent } from "../../color/components/palette-drop/palette-selector/palette-selector.component";
import { HeaderComponent } from "../../core/components/header/header.component";

@Component({
  selector: "zz-palettes",
  imports: [
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorPaletteComponent,
    NotificationComponent,
    PaletteMenuComponent,
    PaletteSelectorComponent,
    HeaderComponent,
  ],
  templateUrl: "./palettes.component.html",
  host: {
    styles: "display: block;  height: 100vh;  width: 100vw;  overflow-x: hidden;",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettesComponent {
  drawerOpen = signal(false);
  state = inject(ColorStateService);
  store = inject(PaletteStoreService);
}
