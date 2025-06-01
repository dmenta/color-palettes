import { Component, inject, model, signal } from "@angular/core";
import { FontControlComponent } from "./common/font-control/font-control.component";
import { FormsModule } from "@angular/forms";
import { familiasDisponibles } from "./common/font-style/font-configs";
import { IconToggleButtonComponent } from "../core/components/buttons/icon-toggle-button.component";
import { SelectComponent } from "../core/components/select/select.component";
import { DarkModeService } from "../core/service/dark-mode.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [FontControlComponent, FormsModule, IconToggleButtonComponent, SelectComponent],
})
export class AppComponent {
  darkModeService = inject(DarkModeService);
  onStyleChanged(style: string) {
    console.log("Style changed to:", style);
    this.estilo.set(style);
  }
  readonly families = familiasDisponibles.sort((a, b) => a.name.localeCompare(b.name));
  readonly family = model(this.families[4]);
  readonly estilo = signal("");
}
