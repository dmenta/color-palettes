import { Component, HostListener, inject } from "@angular/core";
import { CopyService } from "../../core/service/copy.service";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-gradient-actions",
  imports: [],
  templateUrl: "./gradient-actions.component.html",
  host: {
    class: "block w-full",
  },
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

  saveSVG() {
    const svgContent = this.toSVG();
    this.onSaveFile(`colorina-gradient-${new Date().valueOf()}`, "svg", svgContent);
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
    const orientation = this.state.orientation();
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;

    if (orientation.includes("right")) {
      x2 = 400;
    }
    if (orientation.includes("left")) {
      x1 = 400;
    }

    if (orientation.includes("bottom")) {
      y2 = 200;
    }

    if (orientation.includes("top")) {
      y1 = 200;
    }

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
        <linearGradient id="_Linear1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse" >
${pasos}
        </linearGradient>
    </defs>
</svg>`;
  }
}
