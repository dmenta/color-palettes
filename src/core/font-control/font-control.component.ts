import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, model, Output, signal } from "@angular/core";
import { debounceTime, map } from "rxjs";
import { fontFamily, FontStyleAxeMulti } from "../font-style/font-axe-types";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../components/slider-field/slider-field.component";
import { createPropiedad, propiedad } from "./font-control-propiedades";
import { FontVariationControlComponent } from "./font-variation-control.component";
import { VisibilityButtonComponent } from "../components/visibility-button.component";
import { ResetButtonComponent } from "../components/reset-button.component";
import { ToggleCheckComponent } from "../components/toggle-check.component";

@Component({
  selector: "app-font-control",
  imports: [
    ReactiveFormsModule,
    SliderFieldComponent,
    FontVariationControlComponent,
    VisibilityButtonComponent,
    ResetButtonComponent,
    ToggleCheckComponent,
  ],
  templateUrl: "./font-control.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FontControlComponent {
  reset() {
    this.formGroup.reset();
    this.setVisible(true);
  }
  setVisible(visible: boolean) {
    this.visible.set(visible);
  }
  toggleVisible() {
    this.visible.update((current) => !current);
  }

  visible = model(true);

  limpio = signal(true);

  variationsChanged(propiedad: string) {
    this.formGroup.controls[this.variations!.propiedad.name].setValue(propiedad);
  }
  private _family: fontFamily | null = null;

  @Input({ required: true }) set fontFamily(value: fontFamily) {
    this._family = value;
    if (value) {
      this.estadoInicial.set(null);
      this.initialize(value);
    }
  }
  get fontFamily(): fontFamily | null {
    return this._family;
  }
  @Input() labelLength?: number = 5;
  @Input() valueLength?: number = 4;
  @Output() styleChanged = new EventEmitter<string>();

  private fb: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({});

  propiedades: propiedad<string | number>[] = [];

  variations: FontStyleAxeMulti | null = null;

  estadoInicial = signal<string | null>(null);

  private initialize(family: fontFamily) {
    this.variations = family.propiedades.find((prop) => prop.type === "multi") as FontStyleAxeMulti | null;

    this.propiedades = family.propiedades.map((prop) => createPropiedad(prop));
    this.formGroup = this.fb.nonNullable.group(
      this.propiedades.reduce((acc, propiedad) => {
        if (propiedad.type === "single") {
          acc[propiedad.name] =
            typeof propiedad.parte.defaultValue === "string"
              ? this.fb.nonNullable.control(propiedad.parte.defaultValue)
              : this.fb.nonNullable.control(propiedad.parte.defaultValue);
        } else if (propiedad.type === "multi") {
          acc[propiedad.name] = this.fb.nonNullable.control<string>("");
        } else if (propiedad.type === "boolean") {
          acc[propiedad.name] = this.fb.nonNullable.control<boolean>(propiedad.parte.defaultValue);
        }
        return acc;
      }, {} as { [key: string]: FormControl<boolean> | FormControl<number> | FormControl<string> })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(10),
        map((values) => {
          const styles = this.fontFamily!.propiedades.map((axe) => {
            const value = values[axe.propiedad.name];
            if (axe.type === "single") {
              return `${axe.propiedad.name}: ${axe.propertyValue(value).value}`;
            } else if (axe.type === "multi") {
              return (value ?? "") === "" ? null : value;
            } else {
              return `${axe.propiedad.name}: ${axe.propertyValue(value).value}`;
            }
          });
          return [`font-family: '${this.fontFamily!.name}'`, "font-optical-sizing: auto", ...styles].join("; ");
        })
      )
      .subscribe((style) => {
        const inicial = this.estadoInicial();
        if (inicial === null) {
          this.estadoInicial.set(style);
          this.setVisible(true);
          this.limpio.set(true);
        } else {
          this.limpio.set(inicial === style);
        }

        this.styleChanged.emit(style);
      });
  }
}
