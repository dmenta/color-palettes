import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { GradientActionsComponent } from "../../gradient/gradient-actions/gradient-actions.component";
import { ReactiveFormsModule } from "@angular/forms";
import { fromEvent } from "rxjs";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientColorsComponent } from "../../gradient/gradient-colors/gradient-colors.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { OrientationCompassComponent } from "../../gradient/orientation-compass/orientation-compass.component";
import { GradientStateService } from "../../gradient/services/gradient-state.service";
import { DoubleBezierPanelComponent } from "../../gradient/double-bezier-panel/double-bezier-panel.component";

@Component({
  selector: "zz-double-bezier-gradient",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    GradientColorsComponent,
    DoubleBezierPanelComponent,
    GradientActionsComponent,
    OrientationCompassComponent,
  ],
  templateUrl: "./double-bezier-gradient.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoubleBezierGradientComponent {
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
