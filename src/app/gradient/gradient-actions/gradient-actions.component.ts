import { Component, HostListener, inject } from "@angular/core";
import { CopyService } from "../../core/service/copy.service";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-gradient-actions",
  imports: [],
  templateUrl: "./gradient-actions.component.html",
})
export class GradientActionsComponent {
  copyService = inject(CopyService);
  state = inject(GradientStateService);

  @HostListener("document:keydown.control.shift.c", ["$event"])
  handleCopyShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.copy();
  }

  copy() {
    this.onSaveFile("gradient", "svg", this.toSVG());
    // this.copyService.copy(this.toSVG(), "Gradient  copied!");

    // this.copyService.copy(this.state.gradient().gradient, "Gradient  copied!");
  }

  public onSaveFile(name: string, extension: string, content: string): void {
    let fileName = name + "." + extension;
    let fileContent = content;

    const file = new Blob([fileContent], { type: "image/svg+xml" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  }

  toSVG() {
    const pasos = this.state
      .gradient()
      .pasosRGB.map(
        (p) => `        <stop offset="${(p.offset / 100).toFixed(3)}" style="stop-color:${p.color};stop-opacity:1"/>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg width="100%" height="100%" viewBox="0 0 400 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <rect x="0" y="0" width="400" height="200" style="fill:url(#_Linear1);"/>
    <defs>
        <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(400,200,-200,400,0,0)">
${pasos}
        </linearGradient>
    </defs>
</svg>`;
  }
}
