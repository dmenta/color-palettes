import { Component, computed, inject, model, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DarkModeService } from "../core/service/dark-mode.service";
import { MultiValuePropertyFormComponent } from "./common/new/font-form/font-variation-form/font-variation-form.component";
import { createFontConfig, FontFamily } from "./common/new/font-configuration/fonts";
import { MultivaluePropertyConfiguration } from "./common/new/font-configuration/multivalue-property";
import { SingleValuePropertiesFormComponent } from "./common/new/font-form/font-single-form/font-singles-form.componente";
import { SingleValueProperty } from "./common/new/font-configuration/singlevalue-property";
import { SelectComponent } from "../core/components/select/select.component";
import { IconToggleButtonComponent } from "../core/components/buttons/icon-toggle-button.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [
    FormsModule,
    IconToggleButtonComponent,
    SelectComponent,
    MultiValuePropertyFormComponent,
    SingleValuePropertiesFormComponent,
  ],
})
export class AppComponent {
  darkModeService = inject(DarkModeService);
  estilosSingle = signal<string[]>([]);
  estiloMulti = signal<{ name: string; value: string }[]>([]);

  estiloMultiChange(name: string, value: string | null) {
    this.estiloMulti.update((current) => {
      const index = current.findIndex((item) => item.name === name);
      if (value === null && index === -1) {
        return current;
      }

      if (value === null) {
        current.splice(index, 1);
      } else if (index !== -1) {
        current[index].value = value;
      } else {
        current.push({ name, value });
      }

      return [...current];
    });
  }

  estilos = computed(() => {
    const family = this.family();
    if (!family) {
      return [];
    }

    return [
      `font-family: ${family.name}`,
      "font-optical-sizing: auto",
      ...this.estilosSingle(),
      ...this.estiloMulti().map((prop) => prop.value),
    ].join("; ");
  });
  readonly families: FontFamily[] = createFontConfig();
  readonly family = model<FontFamily>(this.families[0]);

  singleValueConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return [];
    }
    return familia.properties.filter((prop) => prop.propertyType === "single") as SingleValueProperty[];
  });

  multiValueConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return [];
    }
    return familia.properties.filter((prop) => prop.propertyType === "multi") as MultivaluePropertyConfiguration[];
  });
  readonly estilo = signal("");
}
