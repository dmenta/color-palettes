import { Component, computed, effect, model, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectComponent } from "../../../../core/components/select/select.component";
import { FontFamily } from "../font-configuration/font-family";
import { fontFamilies } from "../font-configuration/fonts";
import { MultivaluePropertyConfiguration } from "../font-configuration/multivalue-property";
import { SingleValuePropertyConfiguration } from "../font-configuration/singlevalue-property";
import { SingleValuePropertiesFormComponent } from "../font-form/font-single-form/font-singles-form.componente";
import { MultiValuePropertyFormComponent } from "../font-form/font-variation-form/font-variation-form.component";

@Component({
  selector: "app-font-sampler",
  templateUrl: "./font-sampler.component.html",
  imports: [FormsModule, SelectComponent, MultiValuePropertyFormComponent, SingleValuePropertiesFormComponent],
})
export class FontSamplerComponent {
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
  readonly estiloChanged = output<string | null>();
  estilos = computed(() => {
    const family = this.family();
    if (!family) {
      return null;
    }

    return [
      `font-family: ${family.name}`,
      "font-optical-sizing: auto",
      ...this.estilosSingle(),
      ...this.estiloMulti().map((prop) => prop.value),
    ].join("; ");
  });
  readonly families: FontFamily[] = fontFamilies;
  readonly family = model<FontFamily>(this.families[0]);

  singleValueConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return [];
    }
    return familia.properties.filter((prop) => prop.propertyType === "single") as SingleValuePropertyConfiguration[];
  });

  multiValueConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return [];
    }
    return familia.properties.filter((prop) => prop.propertyType === "multi") as MultivaluePropertyConfiguration[];
  });

  constructor() {
    effect(() => {
      const estilos = this.estilos();
      this.estiloChanged.emit(estilos);
    });
  }
}
