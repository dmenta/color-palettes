import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { GradientStateService } from "../../gradient/simple/services/gradient-state.service";
import { OrientationCompassComponent } from "../../gradient/orientation-compass/orientation-compass.component";
import { fromEvent } from "rxjs";
import { GradientColorsComponent } from "../../gradient/simple/gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "../../gradient/simple/bezier-panel/bezier-panel.component";
import { GRADIENT_STATE_TOKEN } from "../../gradient/models/gradient-state.model";

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
