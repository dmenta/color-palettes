import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DarkModeService } from "../core/service/dark-mode.service";
import { IconToggleButtonComponent } from "../core/components/buttons/icon-toggle-button.component";
import { TextoSimuladoComponent } from "./common/font-control/font-form/texto-simulado/texto-simulado.component";
import { FontSamplerComponent } from "./common/font-control/font-sampler/font-sampler.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [FormsModule, IconToggleButtonComponent, FontSamplerComponent, TextoSimuladoComponent],
})
export class AppComponent {
  darkModeService = inject(DarkModeService);

  estilo = signal<string | null>(null);
}
