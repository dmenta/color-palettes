import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientColorsComponent {
  state = inject(GradientStateService);

  swap() {
    const startColor = this.state.startRGBColor();
    const endColor = this.state.endRGBColor();
    this.state.onStartColorChange(endColor);
    this.state.onEndColorChange(startColor);
  }

  onColorEndChange(rgb: ColorValues) {
    this.state.onEndColorChange(rgb);
  }
  onColorStartChange(rgb: ColorValues) {
    this.state.onStartColorChange(rgb);
  }
}
