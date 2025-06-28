import { Component } from "@angular/core";
import { DarkModeToggleComponent } from "../../../../core/components/dark-mode-toggle/dark-mode-toggle.component";

@Component({
  selector: "zz-layout-header",
  imports: [DarkModeToggleComponent],
  templateUrl: "./layout-header.component.html",
  styleUrl: "./layout-header.component.css",
})
export class LayoutHeaderComponent {}
