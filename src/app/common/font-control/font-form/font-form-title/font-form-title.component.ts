import { Component, effect, input, model, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IconButtonDirective } from "../../../../../core/components/buttons/icon-button.directive";
import { IconToggleButtonComponent } from "../../../../../core/components/buttons/icon-toggle-button.component";
import { IconDirective } from "../../../../../core/components/icon/icon.directive";

@Component({
  selector: "app-font-form-title",
  imports: [ReactiveFormsModule, IconDirective, IconButtonDirective, IconToggleButtonComponent],
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
      console.debug("FontFormTitleComponent: modificado", modificado);
      if (!modificado) {
        this.visible.set(true);
      }
    });
  }
}
