import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { debounceTime, map, startWith } from "rxjs";
import { fontFamily, FontStyleAxeMulti } from "../font-style/font-axe-types";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../slider-field/slider-field.component";
import { createPropiedad, propiedad } from "./font-control-propiedades";
import { FontVariationControlComponent } from "./font-variation-control.component";

@Component({
  selector: "app-font-control",
  imports: [ReactiveFormsModule, SliderFieldComponent, FontVariationControlComponent],
  templateUrl: "./font-control.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FontControlComponent {
  variationsChanged(propiedad: string) {
    this.formGroup.controls[this.variations!.propiedad.name].setValue(propiedad);
  }
  private _family: fontFamily | null = null;

  @Input({ required: true }) set fontFamily(value: fontFamily) {
    this._family = value;
    if (value) {
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

  private initialize(family: fontFamily) {
    this.variations = family.propiedades.find((prop) => prop.type === "multi") as FontStyleAxeMulti | null;

    this.propiedades = family.propiedades.map((prop) => createPropiedad(prop));
    this.formGroup = this.fb.nonNullable.group(
      this.propiedades.reduce((acc, propiedad) => {
        if (propiedad.type === "single") {
          acc[propiedad.name] = this.fb.nonNullable.control<number>(propiedad.parte.defaultValue);
        } else {
          acc[propiedad.name] = this.fb.nonNullable.control<string>("");
        }
        return acc;
      }, {} as { [key: string]: FormControl<number> | FormControl<string> })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(10),
        startWith(this.formGroup.value),
        map((values) => {
          const styles = this.fontFamily!.propiedades.map((axe) => {
            const value = values[axe.propiedad.name];
            if (axe.type === "single") {
              return `${axe.propiedad.name}: ${axe.propertyValue(value).value}`;
            } else {
              return (value ?? "") === "" ? null : value;
            }
          });
          return [`font-family: '${this.fontFamily!.name}'`, ...styles].join("; ");
        })
      )
      .subscribe((style) => {
        this.styleChanged.emit(style);
      });
  }
}
