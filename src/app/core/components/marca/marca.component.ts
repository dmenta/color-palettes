import { Component, input } from "@angular/core";

@Component({
  selector: "zz-marca",
  imports: [],
  templateUrl: "./marca.component.html",
})
export class MarcaComponent {
  format = input("horizontal" as "horizontal" | "half" | "quarter" | "vertical");
}
