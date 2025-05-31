import { Component, model, signal } from "@angular/core";
import { FontControlComponent } from "../core/font-control/font-control.component";
import { FormsModule } from "@angular/forms";
import { familiasDisponibles } from "../core/font-style/font-configs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [FontControlComponent, FormsModule],
})
export class AppComponent {
  readonly families = familiasDisponibles.sort((a, b) => a.name.localeCompare(b.name));
  readonly family = model(this.families[0]);
  readonly estilo = signal("");
}
