import { Component, computed, input, output } from "@angular/core";
import { combineLatest, debounce, debounceTime, map, switchMap } from "rxjs";
import { fontFamily } from "../font-style/font-axe-types";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SliderFieldComponent } from "../slider-field/slider-field.component";
import { NgTemplateOutlet } from "@angular/common";
import { createPropiedad, formWithGroups } from "./font-control-propiedades";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-font-control",
  imports: [ReactiveFormsModule, SliderFieldComponent, NgTemplateOutlet],
  templateUrl: "./font-control.component.html",
})
export class FontControlComponent {
  onChange() {
    console.log("FontControlComponent.onChange");
  }
  readonly fontFamily = input.required<fontFamily>();
  readonly labelLength = input(4, { transform: (value: number) => Math.max(1, value ?? 5) });
  readonly valueTextLength = input(5, { transform: (value: number) => Math.max(1, value ?? 5) });
  readonly styleChanged = output<string>();

  propiedades = computed(() => this.fontFamily().propiedades.map((axe) => createPropiedad(axe)));

  formGroup = computed(() =>
    this.propiedades().reduce((group, propiedad) => {
      group.addControl(propiedad.name, propiedad.control);
      return group;
    }, new FormGroup<formWithGroups<number>>({}))
  );

  constructor() {
    toObservable(this.propiedades)
      .pipe(
        switchMap((propiedades) => combineLatest(propiedades.map((propiedad) => propiedad.value$))),
        debounceTime(10),
        map((values) => [
          `font-family: '${this.fontFamily().name}'`,
          ...values.filter((v) => v !== null && v !== undefined),
        ])
      )
      .subscribe((values) => {
        this.styleChanged.emit(values.join("; "));
      });
  }
}
