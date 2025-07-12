import { ChangeDetectionStrategy, Component, HostListener, inject } from "@angular/core";
import { rgbToHex } from "../../../../color/model/color";
import { CopyService } from "../../../../core/service/copy.service";
import { GradientColors, GRADIENT_COLORS_TOKEN } from "../../models/gradient-state.model";
import { gradientTo } from "../../gradient-export";

@Component({
  selector: "zz-gradient-actions",
  imports: [],
  templateUrl: "./gradient-actions.component.html",
  host: {
    class: "block w-full",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientActionsComponent {
  copyService = inject(CopyService);
  state: GradientColors = inject(GRADIENT_COLORS_TOKEN);

  @HostListener("document:keydown.control.shift.c", ["$event"])
  handleCopyShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.copy();
  }

  @HostListener("document:keydown.control.shift.g", ["$event"])
  handleSvgShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.copy();
  }

  copy() {
    this.copyService.copy(this.state.gradient().gradient, "Gradient  copied!");
    // this.copyService.copy(
    //   (this.state as any)
    //     .points()
    //     .map((p: Point) => `${p.x.toLocaleString("es-AR")}\t${p.y.toLocaleString("es-AR")}`)
    //     .join("\r\n"),
    //   "Points copied!"
    // );
  }

  saveAsImage() {
    const start = this.state.startRGBColor();
    const end = this.state.endRGBColor();
    const angleDegrees = this.state.angleDegrees();
    const name = `${rgbToHex(start)}_${rgbToHex(end)}_${angleDegrees}deg_${this.displayDimensions().width}x${
      this.displayDimensions().height
    }`;
    gradientTo.image(this.state.gradient().rgbStops, this.state.angleDegrees(), this.displayDimensions(), name);
  }

  saveSVG() {
    const start = this.state.startRGBColor();
    const end = this.state.endRGBColor();
    const angleDegrees = this.state.angleDegrees();
    const name = `${rgbToHex(start)}_${rgbToHex(end)}_${angleDegrees}deg_${this.displayDimensions().width}x${
      this.displayDimensions().height
    }`;

    gradientTo.svg(this.state.gradient().rgbStops, this.state.angleDegrees(), name);
  }

  private displayDimensions() {
    const isTouchDevice = "ontouchstart" in document.documentElement;
    if (!isTouchDevice) {
      return { width: 1920, height: 1080 };
    }

    const width = window.innerWidth ?? document.documentElement.clientWidth ?? 1920;
    const height = screen.height ?? window.innerHeight ?? 1080;
    const ratio = window.devicePixelRatio || 1;

    return { width: Math.floor(width * ratio), height: Math.floor(height * ratio) };
  }
}
