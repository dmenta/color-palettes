import { Component, computed, ElementRef, EventEmitter, input, Output, Signal, ViewChild } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModel, Triple } from "../../model/colors.model";
import { toRgb } from "../color";
import { RgbDisplayComponent } from "../rgb-display/rgb-display.component";
import { ColorSelectorComponent } from "../selector/color-selector.component";

@Component({
  selector: "zz-color-sample",
  imports: [
    ReactiveFormsModule,
    FullWidthColorSwatchDirective,
    RoundedDirective,
    ShadowDirective,
    RgbDisplayComponent,
    ColorSelectorComponent,
  ],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  colorModel = input.required<ColorModel>({ alias: "model" });
  currentColor = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  texto: Signal<string> | undefined = undefined;
  rgb: Signal<Triple<number>>;

  @Output() newColor = new EventEmitter<Triple<number>>();

  @ViewChild("swatch", { static: true }) swatchEl?: ElementRef<HTMLElement>;

  ngOnInit() {
    this.texto = computed(() => this.colorModel()?.convert(this.currentColor()) ?? "");
    this.rgb = computed(() => toRgb(this.texto() ?? "rgb(0, 0, 0)"));
  }

  changeColor(values: Triple<number>) {
    this.newColor.emit(values);
  }
}
