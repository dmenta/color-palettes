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
    this.copyService.copy(this.state.gradient().gradient, "Gradient  copied!");
  }
}
