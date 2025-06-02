import { Component, input } from "@angular/core";

@Component({
  selector: "app-icon",
  template: `
    <span class="material-symbols-rounded align-text-top" aria-hidden="true">
      {{ name() }}
    </span>
  `,
})
export class IconComponent {
  name = input<string>();
}
