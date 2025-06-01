import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-icon-button",
  template: `
    <div (click)="$event.stopPropagation()" class="inline-block ">
      <button
        [disabled]="disabled()"
        type="button"
        class="appearance-none border-none disabled:opacity-50  disabled:pointer-events-none
           bg-black/10 hover:bg-black/20 dark:bg-gray-300/10 
       dark:hover:bg-gray-300/20 aspect-square w-10 rounded-lg 
       ring-gray-600/50 outline-none  dark:ring-gray-300/60 focus:ring-2 focus:ring-offset-0
 transition-all duration-150 active:scale-90"
        (click)="onClick($event)">
        <span class="material-symbols-rounded align-text-top" aria-hidden="true">
          <ng-content></ng-content>
        </span>
      </button>
    </div>
  `,
})
export class IconButtonComponent {
  disabled = input<boolean>();
  click = output<MouseEvent>();

  onClick(event: MouseEvent) {
    this.click.emit(event);
    event.stopPropagation();
  }
}
