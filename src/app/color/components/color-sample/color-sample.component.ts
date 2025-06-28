import { Component, computed, ElementRef, EventEmitter, input, Output, Signal, ViewChild } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModel, Triple } from "../../model/colors.model";
import { toRgb } from "../color";
import { ColorValuesDisplayComponent } from "../color-values-display/color-values-display.component";
import { ColorSelectorComponent } from "../selector/color-selector.component";

@Component({
  selector: "zz-color-sample",
  imports: [
    ReactiveFormsModule,
    FullWidthColorSwatchDirective,
    RoundedDirective,
    ShadowDirective,
    ColorValuesDisplayComponent,
    ColorSelectorComponent,
  ],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  colorModel = input.required<ColorModel>({ alias: "color-model" });

  currentColor = input<Triple<number> | undefined>(undefined, { alias: "current-color" });

  rgb: Signal<Triple<number>>;

  @Output() newColor = new EventEmitter<Triple<number>>();

  @ViewChild("swatch", { static: true }) swatchEl?: ElementRef<HTMLElement>;

  ngOnInit() {
    this.rgb = computed(() => {
      const currentColor = this.currentColor();
      return currentColor ? toRgb(this.colorModel()?.convert(currentColor)) : [0, 0, 0];
    });
  }

  changeColor(values: Triple<number>) {
    this.newColor.emit(values);
  }
}
