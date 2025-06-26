import { Component, computed, ElementRef, EventEmitter, input, Output, Signal, ViewChild } from "@angular/core";
import { FullWidthColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModel, Triple } from "../../model/colors.model";
import { ColorToRgbPipe } from "../color-swatch/color-to-rgb.pipe";
import { IconDirective } from "../../../core/components/icon/icon.directive";
import { IconButtonDirective } from "../../../core/components/buttons/icon-button.directive";
import { RgbEditComponent } from "../rgb-edit/rgb-edit.component";

@Component({
  selector: "zz-color-sample",
  imports: [
    ReactiveFormsModule,
    ColorToRgbPipe,
    FullWidthColorSwatchDirective,
    IconButtonDirective,
    RoundedDirective,
    ShadowDirective,
    IconDirective,
    RgbEditComponent,
  ],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  colorModel = input.required<ColorModel>({ alias: "model" });
  currentColor = input<Triple<number> | undefined>(undefined, { alias: "color-base" });

  texto: Signal<string> | undefined = undefined;
  rgb: Signal<string> | undefined = undefined;
  baseRGB: Signal<string> | undefined = undefined;

  @Output() newColor = new EventEmitter<Triple<number>>();

  @ViewChild("swatch", { static: true }) swatchEl?: ElementRef<HTMLElement>;

  ngOnInit() {
    this.texto = computed(() => this.colorModel()?.convert(this.currentColor()) ?? "");
  }
  changeColor(values: Triple<number>, _dialog: HTMLDialogElement) {
    this.newColor.emit(values);
    _dialog.close();
  }
}
