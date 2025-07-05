import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { GradientOrientation, orientationsDefinitions } from "../models/orientations";
import { GradientStateService } from "../services/gradient-state.service";
import { Subscription } from "rxjs";

@Component({
  selector: "zz-orientation-selector",
  imports: [ReactiveFormsModule],
  templateUrl: "./orientation-selector.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientOrientationSelectorComponent implements OnInit, OnDestroy {
  private valueChangeSubscription: Subscription | null = null;

  orientationsValues = orientationsDefinitions;

  state = inject(GradientStateService);

  orientationGroup = new FormGroup<{ orientation: FormControl<GradientOrientation> }>({
    orientation: new FormControl(this.state.orientation(), { nonNullable: true }),
  });

  ngOnInit() {
    this.valueChangeSubscription = this.orientationGroup.valueChanges.subscribe((values) => {
      this.state.onOrientationChange(values.orientation ?? "to right bottom");
    });
  }

  ngOnDestroy(): void {
    this.valueChangeSubscription?.unsubscribe();
  }
}
