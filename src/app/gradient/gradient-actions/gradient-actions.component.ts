import { ChangeDetectionStrategy, Component, HostListener, inject } from "@angular/core";
import { CopyService } from "../../core/service/copy.service";
import { GradientStateService } from "../services/gradient-state.service";
import { gradientToImage, gradientToSVG } from "../models/gradient-points";

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
  state = inject(GradientStateService);

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
  }

  saveAsImage() {
    gradientToImage(this.state.gradient().rgbStops, this.state.angleDegrees());
  }

  saveSVG() {
    gradientToSVG(this.state.gradient().rgbStops, this.state.orientation().includes("right") ? 0 : 90);
  }
}
