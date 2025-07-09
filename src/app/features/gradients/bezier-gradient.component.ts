import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GradientColorsComponent } from "../../gradient/gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "../../gradient/bezier-panel/bezier-panel.component";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { GradientStateService } from "../../gradient/services/gradient-state.service";
import { OrientationCompassComponent } from "../../gradient/orientation-compass/orientation-compass.component";
import { fromEvent } from "rxjs";
import { GRADIENT_STATE_TOKEN } from "../../gradient/services/gradient-state.model";

@Component({
  selector: "zz-test-col",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    GradientColorsComponent,
    BezierPanelComponent,
    GradientActionsComponent,
    OrientationCompassComponent,
  ],
  templateUrl: "./bezier-gradient.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: GRADIENT_STATE_TOKEN, useExisting: GradientStateService }],
})
export class BezierGradientComponent {
  state = inject(GradientStateService);
  bezierSize = 280;
  compassSize = 130;

  ngOnInit() {
    fromEvent(document, "touchstart", { passive: true, once: true }).subscribe(() => {
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
