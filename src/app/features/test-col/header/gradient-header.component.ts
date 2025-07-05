import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DarkModeToggleComponent } from "../../../core/components/dark-mode-toggle/dark-mode-toggle.component";
import { MarcaComponent } from "../../../core/components/marca/marca.component";

@Component({
  selector: "zz-gradients-header",
  imports: [DarkModeToggleComponent, MarcaComponent],
  templateUrl: "./gradient-header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientHeaderComponent {}
