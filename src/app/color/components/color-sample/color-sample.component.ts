import { Component, computed, ElementRef, Host, input, Signal, ViewChild } from "@angular/core";
import { FullWidthColorSwatchDirective, SquareColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModel, Triple } from "../../model/colors.model";
import Color from "colorjs.io";
import { ColorToRgbPipe } from "../color-swatch/color-to-rgb.pipe";
@Component({
  selector: "zz-color-sample",
  imports: [
    ColorToRgbPipe,
    FullWidthColorSwatchDirective,
    FormsModule,
    ReactiveFormsModule,
    ShadowDirective,
    RoundedDirective,
  ],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  colorModel = input.required<ColorModel>({ alias: "model" });

  values = input<Triple<number> | undefined>(undefined);

  currentColor: Signal<Triple<number>> | undefined = undefined;
  texto: Signal<string> | undefined = undefined;
  rgb: Signal<string> | undefined = undefined;
  baseRGB: Signal<string> | undefined = undefined;

  @ViewChild("swatch", { static: true }) swatchEl?: ElementRef<HTMLElement>;

  ngOnInit() {
    this.currentColor = computed(() => {
      const valores = this.values() ?? this.colorModel()?.defaultValues() ?? ([0, 0, 0] as Triple<number>);
      return valores;
    });
    this.texto = computed(() => this.colorModel()?.convert(this.currentColor()) ?? "");
  }
}
