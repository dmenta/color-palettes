import { Component, output, signal } from "@angular/core";
import { ColorSelectorComponent } from "../../../color/components/color-sample/color-selector/color-selector.component";
import { ColorValues } from "../../../color/model/colors.model";
import { toOklch } from "../../../color/model/color";

@Component({
  selector: "zz-gradient-colors",
  imports: [ColorSelectorComponent],
  templateUrl: "./gradient-colors.component.html",
})
export class GradientColorsComponent {
  colorSource = signal<ColorValues>([23, 132, 186]);
  colorDestination = signal<ColorValues>([78, 208, 86]);

  sourceColorChanged = output<ColorValues>();
  destinationColorChanged = output<ColorValues>();

  onColorDestinationChange(rgb: ColorValues) {
    this.destinationColorChanged.emit(toOklch(this.rgbText(rgb)));
  }
  onColorSourceChange(rgb: ColorValues) {
    this.sourceColorChanged.emit(toOklch(this.rgbText(rgb)));
  }

  private rgbText(rgb: ColorValues): string {
    return `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})`;
  }

  ngAfterViewInit() {
    this.onColorSourceChange(this.colorSource());
    this.onColorDestinationChange(this.colorDestination());
  }
}
