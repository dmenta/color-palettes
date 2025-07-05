import { Component, Output } from "@angular/core";
import { FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { map } from "rxjs";

@Component({
  selector: "zz-orientation-selector",
  imports: [ReactiveFormsModule],
  templateUrl: "./orientation-selector.component.html",
})
export class GradientOrientationSelectorComponent {
  orientationsValues = orientations;

  orientationGroup = new FormGroup<{ orientation: FormControl<string> }>({
    orientation: new FormControl("to right bottom", { nonNullable: true }),
  });

  @Output() orientationChanged = this.orientationGroup.valueChanges.pipe(
    map((values) => values.orientation ?? "to right bottom")
  );
}
export const orientations = [
  { value: "to right", icon: "&#x2192;", class: "rotate-90" },
  { value: "to right bottom", icon: "&#x2198;", class: "rotate-135" },
  { value: "to bottom", icon: "&#x2193;", class: "rotate-180" },
  { value: "to left bottom", icon: "&#x2199;", class: "-rotate-135" },
  { value: "to left", icon: "&#x2190;", class: "-rotate-90" },
  { value: "to left top", icon: "&#x2196;", class: "-rotate-45" },
  { value: "to top", icon: "&#x2191;", class: "rotate-0" },
  { value: "to right top", icon: "&#x2197;", class: "rotate-45" },
];
