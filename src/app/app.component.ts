import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { RouterOutlet } from "@angular/router";
import { DarkModeService } from "./core/service/dark-mode.service";

@Component({
  selector: "zz-root",
  templateUrl: "./app.component.html",
  imports: [RouterOutlet, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  darkModeService = inject(DarkModeService);
}
