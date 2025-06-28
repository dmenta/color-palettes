import { Component, Output, EventEmitter, input, effect, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { rgbFromHex, rgbToHex, toContrast } from "../color";
import { Triple } from "../../model/colors.model";

@Component({
  selector: "zz-color-selector",
  template: ` @if(colorControl){
    <input
      type="color"
      class="rounded-md appearance-none [&::-webkit-color-swatch]:rounded-md
  [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0 shadow-md shadow-black/20 border-2
  focus:ring-1 focus:ring-gris-600/100"
      [class]="{ 'border-white/40': borderColor() === 'white', 'border-black/40': borderColor() === 'black' }"
      [formControl]="colorControl"
      (change)="updateColor()" />
    }`,
  imports: [ReactiveFormsModule],
})
export class ColorSelectorComponent {
  colorControl: FormControl<string> | undefined = undefined;
  /**
   * Color value in hexadecimal format. (e.g. #000000)
   * or a Triple<number> representing RGB values.
   */
  value = input("#000000", {
    alias: "color",
    transform: (value?: Triple<number> | string | undefined) => {
      const color = value ?? "#000000";
      if (typeof color === "string") {
        return color.startsWith("#") ? color : `#${color}`;
      }
      return rgbToHex(color);
    },
  });

  /**
   * Emits the color value when it changes.
   * @type {EventEmitter<Triple<number>>}
   */
  @Output("color-change") public colorChange = new EventEmitter<Triple<number>>();
  borderColor = signal("");

  constructor() {
    effect(() => {
      this.colorControl?.setValue(this.value());
      const borderColor = toContrast(this.value());
      this.borderColor.set(borderColor);
    });
  }
  ngOnInit() {
    const borderColor = toContrast(this.value());
    this.borderColor.set(borderColor);
    this.colorControl = new FormControl<string>(this.value(), { nonNullable: true });
  }
  public updateColor() {
    this.colorChange.emit(rgbFromHex(this.colorControl!.value));
  }
}
