import { Component, effect, input, model, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconButtonComponent } from "../../../../../core/components/buttons/icon-button.component";
import { IconToggleButtonComponent } from "../../../../../core/components/buttons/icon-toggle-button.component";

@Component({
  selector: "app-font-form-title",
  imports: [ReactiveFormsModule, IconToggleButtonComponent, IconButtonComponent],
  templateUrl: "./font-form-title.component.html",
})
export class FontFormTitleComponent {
  title = input<string>("");
  modificado = input(false);
  visible = model(true);

  reset = output<MouseEvent>();

  onReset(event: MouseEvent) {
    this.reset.emit(event);
  }

  constructor() {
    effect(() => {
      const modificado = this.modificado();
      if (!modificado) {
        this.visible.set(true);
      }
    });
  }
}
