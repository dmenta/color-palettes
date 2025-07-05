import { Component, computed, Signal, signal } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "./header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorValues } from "../../color/model/colors.model";
import { gradientFromPoints } from "./gradient-points";
import { bezierPoints, Coordenates } from "./bezier-curve";
import { OrientationSelectorComponent } from "./orientation-selector/orientation-selector.component";
import { CoordenatesSelectorComponent } from "./coordenates-selector/coordenates-selector.component";
import { GradientColorsComponent } from "./gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "./bezier-panel/bezier-panel.component";

@Component({
  selector: "zz-test-col",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    OrientationSelectorComponent,
    CoordenatesSelectorComponent,
    GradientColorsComponent,
    BezierPanelComponent,
  ],
  templateUrl: "./test-col.component.html",
})
export class TestColComponent {
  size = 200;
  private sourceColor = signal<ColorValues>([0, 0, 0]);
  private destinationColor = signal<ColorValues>([0, 0, 0]);

  coords = signal<Coordenates>({
    x1: 50,
    y1: 50,
    x2: 50,
    y2: 50,
  });

  changingCoords = signal<Coordenates>({
    x1: 50,
    y1: 50,
    x2: 50,
    y2: 50,
  });

  orientation = signal("to right");
  points = computed(() => bezierPoints(this.changingCoords()));
  gradient: Signal<{ gradient: string; contrast: string }> = computed(() =>
    gradientFromPoints(this.sourceColor(), this.destinationColor(), this.points!(), this.orientation())
  );

  onColorDestinationChanged(oklch: ColorValues) {
    this.destinationColor.set(oklch);
  }
  onColorSourceChanged(oklch: ColorValues) {
    this.sourceColor.set(oklch);
  }

  onOrientationChanged(orientation: string) {
    this.orientation.set(orientation ?? "to right");
  }

  onCoordsChanging(coords: Coordenates) {
    this.changingCoords.set(coords);
  }

  onCoordsChanged(coords: Coordenates) {
    this.changingCoords.set(coords);
    this.coords.set(coords);
  }
}
