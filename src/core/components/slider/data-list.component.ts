import { Component, Input } from "@angular/core";

@Component({
  selector: "app-data-list",
  templateUrl: "./data-list.component.html",
})
export class DataListComponent {
  private _values: number[] = [];
  @Input() id?: string | null;
  @Input() set values(newValues: number[]) {
    this._values = newValues
      .sort((a, b) => a - b)
      .reduce((acc, val) => {
        if (!acc.includes(val)) {
          acc.push(val);
        }
        return acc;
      }, [] as number[]);
  }

  get values(): number[] {
    return this._values;
  }
}
