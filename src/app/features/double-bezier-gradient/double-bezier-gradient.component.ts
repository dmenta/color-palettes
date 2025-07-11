import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { ReactiveFormsModule } from "@angular/forms";
import { fromEvent } from "rxjs";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { OrientationCompassComponent } from "../../gradient/orientation-compass/orientation-compass.component";
import { DoubleBezierPanelComponent } from "../../gradient/double/double-bezier-panel/double-bezier-panel.component";
import { DoubleGradientColorsComponent } from "../../gradient/double/double-gradient-colors/double-gradient-colors.component";
import { GRADIENT_STATE_TOKEN } from "../../gradient/models/gradient-state.model";
import { DoubleGradientStateService } from "../../gradient/double/services/double-gradient-state.service";

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
