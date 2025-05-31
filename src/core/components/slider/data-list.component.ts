import { Component, Input } from "@angular/core";

@Component({
  selector: "app-data-list",
  templateUrl: "./data-list.component.html",
})
export class DataListComponent {
  @Input() id?: string | null;
  @Input() values?: number[] = [];
}
