import { Component, inject } from "@angular/core";
import { LayoutHeaderComponent } from "./layout-header/layout-header.component";
import { ColorMenuComponent } from "../../components/color-menu/color-menu.component";
import { ColorSampleComponent } from "../../components/color-sample/color-sample.component";
import { ColorRangeSelectorComponent } from "../../components/color-range-selector/color-range-selector.component";
import { ColorAxisComponent } from "../../components/color-axis/color-axis.component";
import { ColorAxisAdvancedConfigComponent } from "../../components/axis-advanced-config/axis-advanced-config.component";
import { ColorStateService } from "../../services/color-statae.service";

@Component({
  selector: "zz-layout",
  imports: [
    LayoutHeaderComponent,
    ColorMenuComponent,
    ColorSampleComponent,
    ColorRangeSelectorComponent,
    ColorAxisComponent,
    ColorAxisAdvancedConfigComponent,
  ],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent {
  state = inject(ColorStateService);
}
