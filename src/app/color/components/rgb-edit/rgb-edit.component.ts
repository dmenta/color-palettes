import { Component, EventEmitter, input, Output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputDirective } from "../../../core/directives/input.directive";
import { Triple } from "../../model/colors.model";
import Color from "colorjs.io";
import { NormalButtonDirective } from "../../../core/components/buttons/normal-button.directive";

@Component({
  selector: "zz-rgb-edit",
  imports: [ReactiveFormsModule, InputDirective, NormalButtonDirective],
  templateUrl: "./rgb-edit.component.html",
})
export class RgbEditComponent {
  rgbTexto = input<string | undefined>(undefined);
  rgbColor: FormGroup<{ r: FormControl<number>; g: FormControl<number>; b: FormControl<number> }> | undefined =
    undefined;

  @Output() newColor = new EventEmitter<Triple<number>>();
  ngOnInit() {
    const rgb = this.getChannels(this.rgbTexto());

    this.rgbColor = new FormGroup({
      r: new FormControl<number>(rgb[0], { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
      g: new FormControl<number>(rgb[1], { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
      b: new FormControl<number>(rgb[2], { nonNullable: true, validators: [Validators.min(0), Validators.max(255)] }),
    });
  }

  aceptar() {
    const { r, g, b } = this.rgbColor?.value ?? { r: 0, g: 0, b: 0 };
    this.newColor.emit([r, g, b] as Triple<number>);
  }
  private getChannels(textoColor: string) {
    const color = new Color(textoColor).to("srgb");

    const r = Math.max(0, Math.min(1, color.r)) * 255;
    const g = Math.max(0, Math.min(1, color.g)) * 255;
    const b = Math.max(0, Math.min(1, color.b)) * 255;

    return [Math.round(r), Math.round(g), Math.round(b)] as Triple<number>;
  }
}
