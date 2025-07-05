import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { GradientOrientation, orientationsDefinitions } from "../models/orientations";
import { GradientStateService } from "../services/gradient-state.service";

@Component({
  selector: "zz-orientation-selector",
  imports: [ReactiveFormsModule],
  templateUrl: "./orientation-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientOrientationSelectorComponent {
  orientationsValues = orientationsDefinitions;

  state = inject(GradientStateService);

  orientationGroup = new FormGroup<{ orientation: FormControl<GradientOrientation> }>({
    orientation: new FormControl(this.state.orientation(), { nonNullable: true }),
  });

  ngOnInit() {
    this.orientationGroup.valueChanges.subscribe((values) => {
      this.state.onOrientationChange(values.orientation ?? "to right bottom");
    });
  }
}
