import { Component, input } from "@angular/core";
import { Triple } from "../../model/colors.model";

@Component({
  selector: "zz-rgb-display",
  imports: [],
  templateUrl: "./rgb-display.component.html",
})
export class RgbDisplayComponent {
  rgb = input(undefined, {
    alias: "rgb",
    transform: (value?: Triple<number> | undefined) => value ?? ([0, 0, 0] as Triple<number>),
  });

  vertical = input(false, { alias: "vertical" });
}
