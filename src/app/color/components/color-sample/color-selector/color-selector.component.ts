import { Component, Output, EventEmitter, input, effect, signal, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ColorValues } from "../../../model/colors.model";
import { rgbFromHex, rgbToHex, toContrast } from "../../../model/color";
import { debounceTime } from "rxjs";

@Component({
  selector: "zz-color-selector",
  template: ` @if(colorControl){
    <input
      type="color"
      class="rounded-md appearance-none [&::-webkit-color-swatch]:rounded-
  [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0 shadow-md shadow-black/40 border-2
  focus:ring-1 focus:ring-gris-600/100"
      [class]="borderColor()"
      [formControl]="colorControl" />
    }`,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSelectorComponent implements OnInit {
  colorControl: FormControl<string> | undefined = undefined;

  border = input<string | undefined>(undefined);
  /**
   * Color value in hexadecimal format. (e.g. #000000)
   * or a ColorValues representing RGB values.
   */
  value = input("#000000", {
    alias: "color",
    transform: (value?: ColorValues | string | undefined) => {
      const color = value ?? "#000000";
      if (typeof color === "string") {
        return color.startsWith("#") ? color : `#${color}`;
      }
      return rgbToHex(color);
    },
  });

  /**
   * Emits the color value when it changes.
   * @type {EventEmitter<ColorValues>}
   */
  @Output("color-change") public colorChange = new EventEmitter<ColorValues>();
  borderColor = signal("");

  constructor() {
    effect(() => {
      this.colorControl?.setValue(this.value());
      if (!this.border()) {
        const borderColor = toContrast(this.value());
        this.borderColor.set(borderColor === "white" ? "border-white/40" : "border-black/40");
      } else {
        this.borderColor.set(this.border()!);
      }
    });
  }
  ngOnInit() {
    if (!this.border()) {
      const borderColor = toContrast(this.value());
      this.borderColor.set(borderColor);
    } else {
      this.borderColor.set(this.border()!);
    }
    this.colorControl = new FormControl<string>(this.value(), { nonNullable: true });

    this.colorControl.valueChanges.pipe(debounceTime(3)).subscribe((value) => {
      this.colorChange.emit(rgbFromHex(value));
    });
  }
}
