import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-reset-button",
  template: `
    <button
      aria-label="Reset"
      [disabled]="disabled()"
      type="button"
      class="scale-75 disabled:opacity-50 disabled:pointer-events-none
       bg-black/10 hover:bg-black/20 dark:bg-gray-300/10 
       dark:hover:bg-gray-300/20 aspect-square w-10 rounded-lg 
       dark:focus:outline-neutral-500 focus:outline-2
       focus:outline-neutral-500
       inline-block active:scale-90 transition-all duration-150"
      (click)="reset.emit()">
      <span class="material-symbols-rounded align-text-top" aria-hidden="true">reset_settings</span>
    </button>
  `,
})
export class ResetButtonComponent {
  disabled = input<boolean>();
  visible = input<boolean>();
  reset = output();
}
