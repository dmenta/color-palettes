import { Component, computed, input, Signal } from "@angular/core";
import { SquareColorSwatchDirective } from "../color-swatch/color-swatch.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RoundedDirective } from "../../../core/directives/rounded.directive";
import { ShadowDirective } from "../../../core/directives/shadow.directive";
import { ColorModel, Triple } from "../../model/colors.model";

@Component({
  selector: "zz-color-sample",
  imports: [SquareColorSwatchDirective, FormsModule, ReactiveFormsModule, ShadowDirective, RoundedDirective],
  templateUrl: "./color-sample.component.html",
})
export class ColorSampleComponent {
  height = input(120);
  colorModel = input.required<ColorModel>({ alias: "model" });

  values = input<Triple<number> | undefined>(undefined);

  currentColor: Signal<Triple<number>> | undefined = undefined;
  texto: Signal<string> | undefined = undefined;

  ngOnInit() {
    this.currentColor = computed(
      () => this.values() ?? this.colorModel()?.defaultValues() ?? ([0, 0, 0] as Triple<number>)
    );
    this.texto = computed(() => this.colorModel()?.convert(this.currentColor()) ?? "");
  }
}
