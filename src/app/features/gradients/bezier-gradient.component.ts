import { Component, computed, Signal, signal } from "@angular/core";
import { NotificationComponent } from "../../core/components/notification/notification.component";
import { GradientHeaderComponent } from "../../gradient/header/gradient-header.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorValues } from "../../color/model/colors.model";
import { GradientDefinition, gradientFromPoints } from "../../gradient/models/gradient-points";
import { bezierPoints, Coordenates } from "../../gradient/models/bezier-curve";
import { GradientOrientationSelectorComponent } from "../../gradient/orientation-selector/orientation-selector.component";
import { BezierCoordenatesSelectorComponent } from "../../gradient/coordenates-selector/coordenates-selector.component";
import { GradientColorsComponent } from "../../gradient/gradient-colors/gradient-colors.component";
import { BezierPanelComponent } from "../../gradient/bezier-panel/bezier-panel.component";

@Component({
  selector: "zz-test-col",
  imports: [
    NotificationComponent,
    GradientHeaderComponent,
    ReactiveFormsModule,
    GradientOrientationSelectorComponent,
    BezierCoordenatesSelectorComponent,
    GradientColorsComponent,
    BezierPanelComponent,
  ],
  templateUrl: "./bezier-gradient.component.html",
})
export class BezierGradientComponent {
  size = 200;
  private sourceColor = signal<ColorValues>([0, 0, 0]);
  private destinationColor = signal<ColorValues>([0, 0, 0]);

  coords = signal<Coordenates>({
    point1: { x: 50, y: 50 },
    point2: { x: 50, y: 50 },
  });

  changingCoords = signal<Coordenates>({
    point1: { x: 50, y: 50 },
    point2: { x: 50, y: 50 },
  });

  orientation = signal("to right");
  points = computed(() => bezierPoints(this.changingCoords()));
  gradient: Signal<GradientDefinition> = computed(() =>
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
