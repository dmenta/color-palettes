import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GradientOrientationSelectorComponent } from "../../gradient/orientation-selector/orientation-selector.component";
import { GradientColorsComponent } from "../../gradient/gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "../../gradient/bezier-panel/bezier-panel.component";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { GradientStateService } from "../../gradient/services/gradient-state.service";
import { GradientReferenceDirective } from "../../gradient/directives/gradient-reference.directive";

@Component({
  selector: "zz-test-col",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    GradientOrientationSelectorComponent,
    GradientColorsComponent,
    BezierPanelComponent,
    GradientActionsComponent,
    GradientReferenceDirective,
  ],
  templateUrl: "./bezier-gradient.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BezierGradientComponent {
  state = inject(GradientStateService);
  size = 350;
}
