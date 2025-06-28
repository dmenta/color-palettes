import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "zz-root",
  templateUrl: "./app.component.html",
  imports: [RouterOutlet, CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
