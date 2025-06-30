import { Component, inject } from "@angular/core";
import { IconButtonDirective } from "../../../core/directives/icon-button.directive";
import { IconDirective } from "../../../core/directives/icon.directive";
import { StorageService } from "../../../core/service/storage.service";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-save-palette",
  imports: [IconButtonDirective, IconDirective],
  templateUrl: "./save-palette.component.html",
})
export class SavePaletteComponent {
  store = inject(StorageService);
  state = inject(ColorStateService);
  savePalette() {
    throw new Error("Method not implemented.");
  }
  deletePalette() {
    throw new Error("Method not implemented.");
  }
}
