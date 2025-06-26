import { Component, EventEmitter, input, Output, signal, Signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputDirective } from "../../../core/directives/input.directive";
import { Triple } from "../../model/colors.model";
import Color from "colorjs.io";
import { NormalButtonDirective } from "../../../core/components/buttons/normal-button.directive";
import { SquareColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { colorModels, namedColorModels } from "../../model/color-models-definitions";

@Component({
  selector: "zz-rgb-edit",
  imports: [ReactiveFormsModule, InputDirective, NormalButtonDirective, SquareColorSwatchDirective],
  templateUrl: "./rgb-edit.component.html",
})
export class RgbEditComponent {
  rgb = input(undefined, {
    transform: (value?: string | undefined) => this.getChannels(value ?? "rgb(0, 0, 0)"),
  });

  rgbModel = namedColorModels.rgb;
  rgbColor: FormGroup<{ r: FormControl<number>; g: FormControl<number>; b: FormControl<number> }> | undefined =
    undefined;
  newRgb: WritableSignal<Triple<number>> | undefined = undefined;
  @Output() newColor = new EventEmitter<Triple<number>>();
  ngOnInit() {
    this.rgbColor = new FormGroup({
      r: new FormControl<number>(this.rgb()[0], {
        nonNullable: true,
        validators: [Validators.min(0), Validators.max(255)],
      }),
      g: new FormControl<number>(this.rgb()[1], {
        nonNullable: true,
        validators: [Validators.min(0), Validators.max(255)],
      }),
      b: new FormControl<number>(this.rgb()[2], {
        nonNullable: true,
        validators: [Validators.min(0), Validators.max(255)],
      }),
    });

    this.rgbColor.valueChanges.subscribe((value) => {
      const { r, g, b } = value;
      this.newRgb?.set([r, g, b] as Triple<number>);
    });

    this.newRgb = signal(this.rgb());
  }

  aceptar() {
    this.newColor.emit(this.newRgb());
  }
  private getChannels(textoColor: string) {
    const color = new Color(textoColor).to("srgb");

    const r = Math.max(0, Math.min(1, color.r)) * 255;
    const g = Math.max(0, Math.min(1, color.g)) * 255;
    const b = Math.max(0, Math.min(1, color.b)) * 255;

    return [Math.round(r), Math.round(g), Math.round(b)] as Triple<number>;
  }
}
