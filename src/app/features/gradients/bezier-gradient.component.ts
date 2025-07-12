import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/common/components/header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GradientStateService } from "../../gradient/simple/services/gradient-state.service";
import { fromEvent } from "rxjs";
import { GradientColorsComponent } from "../../gradient/simple/gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "../../gradient/simple/bezier-panel/bezier-panel.component";
import { GRADIENT_COLORS_TOKEN, GRADIENT_ORIENTATION_TOKEN } from "../../gradient/common/models/gradient-state.model";
import { GradientActionsComponent } from "../../gradient/common/components/gradient-actions/gradient-actions.component";
import { OrientationCompassComponent } from "../../gradient/common/components/orientation-compass/orientation-compass.component";

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
  providers: [
    { provide: GRADIENT_COLORS_TOKEN, useExisting: GradientStateService },
    { provide: GRADIENT_ORIENTATION_TOKEN, useExisting: GradientStateService },
  ],
})
export class BezierGradientComponent {
  state = inject(GradientStateService);
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
