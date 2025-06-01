import { Component, computed, EventEmitter, inject, Input, model, Output, signal } from "@angular/core";
import { debounceTime, map, tap } from "rxjs";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { createPropiedad, propiedad } from "./font-control-propiedades";
import { FontVariationControlComponent } from "./font-variation-control.component";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { CollapsiblePanelComponent } from "../../../core/components/collapsible-panel/collapsible-panel.component";
import { IconToggleButtonComponent } from "../../../core/components/buttons/icon-toggle-button.component";
import { IconButtonComponent } from "../../../core/components/buttons/icon-button.component";
import { ShowHideComponent } from "../../../core/components/show-hide/show-hide.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { fontFamily, FontStyleAxeMulti } from "../font-style/font-axe-types";

@Component({
  selector: "app-font-control",
  imports: [
    ReactiveFormsModule,
    SliderFieldComponent,
    FontVariationControlComponent,
    ToggleCheckComponent,
    CollapsiblePanelComponent,
    IconToggleButtonComponent,
    IconButtonComponent,
    ShowHideComponent,
  ],
  templateUrl: "./font-control.component.html",
})
export class FontControlComponent {
  expandCollapse(event: MouseEvent) {
    this.collapsed.update((current) => !current);

    event.preventDefault();
    event.stopPropagation();
  }

  collapsed = signal(false);

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
    this.formGroup.controls[this.variations!.name].setValue(propiedad);
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

  propiedades: propiedad[] = [];

  variations: FontStyleAxeMulti | null = null;

  estadoInicial = signal<string | null>(null);
  estadoActual = signal<string | null>(null);
  sinCambios = computed(() => {
    const inicial = this.estadoInicial();
    const actual = this.estadoActual();
    if (inicial === null || actual === null) {
      return true;
    }
    return inicial === actual;
  });

  private initialize(family: fontFamily) {
    this.variations = family.propiedades.find((prop) => prop.type === "multi") as FontStyleAxeMulti | null;

    this.estadoActual.set(null);
    this.estadoInicial.set(null);

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
        tap((values) => {
          this.estadoActual.set(JSON.stringify(values));
        }),
        map((values) => {
          const styles = this.fontFamily!.propiedades.map((axe) => {
            const value = values[axe.name];
            if (axe.type === "single") {
              return `${axe.name}: ${axe.propertyValue(value).value}`;
            } else if (axe.type === "multi") {
              return (value ?? "") === "" ? null : value;
            } else {
              return `${axe.name}: ${axe.propertyValue(value).value}`;
            }
          });
          return [`font-family: '${this.fontFamily!.name}'`, "font-optical-sizing: auto", ...styles].join("; ");
        })
      )
      .subscribe((style) => {
        if (this.sinCambios()) {
          this.estadoInicial.set(JSON.stringify(this.formGroup.value));
        }

        this.styleChanged.emit(style);
      });
  }
}
