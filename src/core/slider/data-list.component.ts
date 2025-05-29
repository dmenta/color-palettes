import { Component, input } from "@angular/core";

@Component({
  selector: "app-data-list",
  templateUrl: "./data-list.component.html",
})
export class DataListComponent {
  readonly id = input<string | null | undefined>();
  readonly values = input<number[] | null | undefined>([]);
}
