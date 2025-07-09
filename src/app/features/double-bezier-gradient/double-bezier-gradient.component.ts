import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { ReactiveFormsModule } from "@angular/forms";
import { fromEvent } from "rxjs";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { OrientationCompassComponent } from "../../gradient/orientation-compass/orientation-compass.component";
import { DoubleBezierPanelComponent } from "../../gradient/double-bezier-panel/double-bezier-panel.component";
import { DoubleGradientStateService } from "../../gradient/services/double-gradient-state.service";
import { GRADIENT_STATE_TOKEN } from "../../gradient/services/gradient-state.model";
import { DoubleGradientColorsComponent } from "../../gradient/double-gradient-colors/double-gradient-colors.component";

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
  providers: [{ provide: GRADIENT_STATE_TOKEN, useExisting: DoubleGradientStateService }],
})
export class DoubleBezierGradientComponent {
  state = inject(GRADIENT_STATE_TOKEN);
  bezierSize = 280;
  compassSize = 130;

  ngOnInit() {
    fromEvent(document, "touchstart", { passive: true }).subscribe(() => {
      this.requestFullscreen();
    });
  }

  private requestFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        console.debug("Error attempting to enable full-screen mode");
      });
    }
  }
}
