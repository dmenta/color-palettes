import { Component, inject } from "@angular/core";
import { colorModels } from "../../model/color-models-definitions";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { ContainerDirective } from "../../../core/directives/containers/container.directive";
import { ColorStateService } from "../../services/color-statae.service";

@Component({
  selector: "zz-color-menu",
  imports: [CollapseVerticalDirective, ContainerDirective],
  templateUrl: "./color-menu.component.html",
  styleUrl: "./color-menu.component.css",
})
export class ColorMenuComponent {
  models = colorModels;

  state = inject(ColorStateService);
}
