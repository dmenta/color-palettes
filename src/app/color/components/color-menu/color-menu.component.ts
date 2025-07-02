import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { colorModels } from "../../model/color-models-definitions";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { ContainerDirective } from "../../../core/directives/container.directive";
import { ColorStateService } from "../../services/color-state.service";

@Component({
  selector: "zz-color-menu",
  imports: [CollapseVerticalDirective, ContainerDirective],
  templateUrl: "./color-menu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorMenuComponent {
  models = colorModels.filter((model) => model.name !== "hex");

  state = inject(ColorStateService);
}
