import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "zz-marca",
  imports: [],
  templateUrl: "./marca.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcaComponent {
  format = input("horizontal" as "horizontal" | "half" | "quarter" | "vertical");
}
