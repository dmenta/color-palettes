import { Component, inject } from "@angular/core";
import { ColorSelectorComponent } from "../../color/components/color-sample/color-selector/color-selector.component";
import { ColorValues } from "../../color/model/colors.model";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-gradient-colors",
  imports: [ColorSelectorComponent],
  templateUrl: "./gradient-colors.component.html",
  host: {
    class: "w-full",
  },
})
export class GradientColorsComponent {
  state = inject(GradientStateService);

  onColorDestinationChange(rgb: ColorValues) {
    this.state.onDestinationColorChange(rgb);
  }
  onColorSourceChange(rgb: ColorValues) {
    this.state.onSourceColorChange(rgb);
  }
}
