import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-visibility-button",
  template: `
    <button
      aria-label="Visibility"
      [disabled]="disabled()"
      type="button"
      class="scale-75 disabled:opacity-50 disabled:pointer-events-none bg-black/10 hover:bg-black/20 dark:bg-gray-300/10 dark:hover:bg-gray-300/20 aspect-square w-10 rounded-lg inline-block active:scale-90 transition-all duration-150"
      (click)="toggle.emit()">
      <span class="material-symbols-rounded align-text-top" aria-hidden="true">{{
        visible() ? "visibility" : "visibility_off"
      }}</span>
    </button>
  `,
})
export class VisibilityButtonComponent {
  disabled = input<boolean>();
  visible = input<boolean>();
  toggle = output();
}
