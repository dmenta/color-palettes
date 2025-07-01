import { Component, inject } from "@angular/core";
import { IconButtonDirective } from "../../../core/directives/icon-button.directive";
import { IconDirective } from "../../../core/directives/icon.directive";
import { ColorStateService } from "../../services/color-state.service";
import { PaletteStoreService } from "../../services/palette-store.service";
import { PaletteInfo } from "../../model/colors.model";
import { CopyService } from "../../services/copy.services";

@Component({
  selector: "zz-save-palette",
  imports: [IconButtonDirective, IconDirective],
  templateUrl: "./save-palette.component.html",
})
export class SavePaletteComponent {
  store = inject(PaletteStoreService);
  state = inject(ColorStateService);
  copyService = inject(CopyService);

  lock() {
    this.store.lockPalette({
      palette: this.state.palette(),
      state: {
        variableConfig: this.state.variableConfig(),
        stepsConfig: this.state.paletteStepsConfig(),
        currentColor: this.state.currentColor(),
        minmax: this.state.minmax(),
      },
    } as PaletteInfo);
  }

  unlock() {
    this.store.unlockPalette();
  }
  copy() {
    this.copyService.copyCurrentPalette();
  }
}
