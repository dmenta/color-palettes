import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LayoutHeaderComponent } from "./layout-header/layout-header.component";
import { ColorMenuComponent } from "../../components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import { ColorRangeSelectorComponent } from "../../components/color-range-selector/color-range-selector.component";
import { ColorAxisAdvancedConfigComponent } from "../../components/axis-advanced-config/axis-advanced-config.component";
import { ColorStateService } from "../../services/color-state.service";
import { ColorPaletteComponent } from "../../components/color-palette/color-palette.component";

@Component({
  selector: "zz-layout",
  imports: [
    LayoutHeaderComponent,
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisAdvancedConfigComponent,
    ColorPaletteComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  state = inject(ColorStateService);
}
