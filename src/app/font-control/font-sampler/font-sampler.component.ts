import { ChangeDetectionStrategy, Component, computed, effect, model, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectComponent } from "../../core/components/select/select.component";
import { SingleValuePropertiesFormComponent } from "../font-form/font-single-form/font-singles-form.componente";
import { MultiValuePropertyFormComponent } from "../font-form/font-variation-form/font-variation-form.component";
import { FontFamily } from "../font-configuration/models/font-family";
import { fontFamilies } from "../font-configuration/models/fonts";
import { MultivaluePropertyConfiguration } from "../font-configuration/models/multivalue-property";
import { SingleValuePropertyConfiguration } from "../font-configuration/models/singlevalue-property";
import { WidthFullDirective } from "../../core/directives/width.directive";

@Component({
  selector: "zz-font-sampler",
  templateUrl: "./font-sampler.component.html",
  imports: [
    FormsModule,
    SelectComponent,
    MultiValuePropertyFormComponent,
    SingleValuePropertiesFormComponent,
    WidthFullDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSamplerComponent {
  estilosSingle = signal<string[]>([]);
  estiloMulti = signal<{ name: string; value: string }[]>([]);

  estiloMultiChange(name: string, value: string | undefined) {
    this.estiloMulti.update((current) => {
      const index = current.findIndex((item) => item.name === name);
      if (value === undefined && index === -1) {
        return current;
      }

      if (value === undefined) {
        current.splice(index, 1);
      } else if (index !== -1) {
        current[index].value = value;
      } else {
        current.push({ name, value });
      }

      return [...current];
    });
  }
  readonly estiloChanged = output<string | undefined>();
  readonly fontFamilyChanged = output<string | undefined>();

  estilos = computed(() => {
    const family = this.family();
    if (!family) {
      return undefined;
    }

    return [...this.estilosSingle(), ...this.estiloMulti().map((prop) => prop.value)].join("; ");
  });
  readonly families: FontFamily[] = fontFamilies;
  readonly family = model<FontFamily>(this.families[0]);

  gruposConfigs = computed(() => {
    const familia = this.family();
    if (!familia) {
      return { single: [] as SingleValuePropertyConfiguration[], multi: [] as MultivaluePropertyConfiguration[] };
    }
    return familia.properties.reduce(
      (acc, prop) => {
        if (prop.propertyType === "single") {
          acc.single.push(prop as SingleValuePropertyConfiguration);
        } else {
          acc.multi.push(prop as MultivaluePropertyConfiguration);
        }
        return acc;
      },
      { single: [] as SingleValuePropertyConfiguration[], multi: [] as MultivaluePropertyConfiguration[] }
    );
  });

  constructor() {
    effect(() => {
      const family = this.family();
      if (family) {
        this.fontFamilyChanged.emit(family.name);
      }
    });

    effect(() => {
      const estilos = this.estilos();
      this.estiloChanged.emit(estilos);
    });
  }
}
