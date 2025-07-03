import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { IconToggleButtonComponent } from "../buttons/icon-toggle-button.component";
import { DarkModeService } from "../../service/dark-mode.service";

@Component({
  selector: "zz-dark-mode-toggle",
  imports: [IconToggleButtonComponent],
  templateUrl: "./dark-mode-toggle.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent {
  darkModeService = inject(DarkModeService);
}
