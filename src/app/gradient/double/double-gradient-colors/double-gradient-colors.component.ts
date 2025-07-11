import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ColorSelectorComponent } from "../../../color/components/color-sample/color-selector/color-selector.component";
import { ColorValues } from "../../../color/model/colors.model";
import { DoubleGradientStateService } from "../services/double-gradient-state.service";

@Component({
  selector: "zz-double-gradient-colors",
  imports: [ColorSelectorComponent],
  templateUrl: "./double-gradient-colors.component.html",
  host: {
    class: "w-full",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoubleGradientColorsComponent {
  state = inject(DoubleGradientStateService);

  onColorEndChange(rgb: ColorValues) {
    this.state.onEndColorChange(rgb);
  }
  onColorCenterChange(rgb: ColorValues) {
    this.state.onCenterColorChange(rgb);
  }
  onColorStartChange(rgb: ColorValues) {
    this.state.onStartColorChange(rgb);
  }
}
