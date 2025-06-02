import { Component, computed, inject, model, Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { familiasDisponibles } from "./common/font-style/font-configs";
import { DarkModeService } from "../core/service/dark-mode.service";
import { MultiValuePropertyFormComponent } from "./common/new/font-form/font-variation-form/font-variation-form.component";
import { fontFamilies, FontFamily } from "./common/new/font-configuration/fonts";
import { MultivaluePropertyConfiguration } from "./common/new/font-configuration/multivalue-property";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [FormsModule, MultiValuePropertyFormComponent],
})
export class AppComponent {
  darkModeService = inject(DarkModeService);
  onStyleChanged(style: string) {
    console.log("Style changed to:", style);
    this.estilo.set(style);
  }
  readonly families: FontFamily[] = fontFamilies;
  readonly family = model<FontFamily | null>(null);

  multiValueConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return [];
    }
    return familia.propiedades.filter((prop) => prop.type === "multi") as MultivaluePropertyConfiguration[];
  });
  readonly estilo = signal("");

  ngOnInit() {
    this.family.set(this.families[0]);
  }
}
