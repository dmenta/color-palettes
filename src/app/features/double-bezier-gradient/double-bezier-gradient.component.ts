import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { fromEvent } from "rxjs";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/common/components/header/gradient-header.component";
import { DoubleBezierPanelComponent } from "../../gradient/double/double-bezier-panel/double-bezier-panel.component";
import { DoubleGradientColorsComponent } from "../../gradient/double/double-gradient-colors/double-gradient-colors.component";
import { DoubleGradientStateService } from "../../gradient/double/services/double-gradient-state.service";
import { GRADIENT_COLORS_TOKEN, GRADIENT_ORIENTATION_TOKEN } from "../../gradient/common/models/gradient-state.model";
import { GradientActionsComponent } from "../../gradient/common/components/gradient-actions/gradient-actions.component";
import { OrientationCompassComponent } from "../../gradient/common/components/orientation-compass/orientation-compass.component";

@Component({
  selector: "zz-double-bezier-gradient",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    DoubleBezierPanelComponent,
    GradientActionsComponent,
    OrientationCompassComponent,
    DoubleGradientColorsComponent,
    DoubleGradientColorsComponent,
  ],
  templateUrl: "./double-bezier-gradient.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: GRADIENT_ORIENTATION_TOKEN, useExisting: DoubleGradientStateService },
    { provide: GRADIENT_COLORS_TOKEN, useExisting: DoubleGradientStateService },
  ],
})
export class DoubleBezierGradientComponent {
  state = inject(DoubleGradientStateService);
  bezierSize = 280;
  compassSize = 130;

  ngAfterViewInit() {
    fromEvent(document, "touchstart", { passive: true }).subscribe(() => {
      this.requestFullscreen();
    });
  }

  private requestFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        console.info("Error attempting to enable full-screen mode");
      });
    }
  }
}
