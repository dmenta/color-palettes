import { Component, input } from "@angular/core";

@Component({
  selector: "app-data-list",
  template: `
    <datalist [id]="id()">
      @for (value of values(); track value) {
      <option [value]="value"></option>
      }
    </datalist>
  `,
})
export class DataListComponent {
  readonly id = input<string | null | undefined>();
  readonly values = input<number[] | null | undefined>([]);
}
