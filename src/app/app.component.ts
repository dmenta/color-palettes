import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DarkModeService } from "./core/service/dark-mode.service";
import { TextoSimuladoComponent } from "./font-control/font-form/texto-simulado/texto-simulado.component";
import { FontSamplerComponent } from "./font-control/font-sampler/font-sampler.component";
import { IconToggleButtonComponent } from "./core/components/buttons/icon-toggle-button.component";
import { BackgroundDirective } from "./core/directives/background.directive";

@Component({
  selector: "zz-root",
  templateUrl: "./app.component.html",
  imports: [FormsModule, FontSamplerComponent, TextoSimuladoComponent, IconToggleButtonComponent, BackgroundDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  darkModeService = inject(DarkModeService);

  estilo = signal<string | null>(null);
}
