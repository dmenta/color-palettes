import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, startWith } from "rxjs";
import { SelectComponent } from "../../../../core/components/select/select.component";
import { ColorStateService } from "../../../services/color-state.service";
import { showValuesOption } from "../../../model/palette.model";

@Component({
  selector: "zz-palette-values-config",
  imports: [FormsModule, ReactiveFormsModule, SelectComponent],
  templateUrl: "./palette-values-config.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletteValuesConfigComponent {
  state = inject(ColorStateService);

  configGroup:
    | FormGroup<{
        showValues: FormControl<{ text: string; value: showValuesOption }>;
      }>
    | undefined = undefined;

  ngOnInit() {
    const valuesConfig = this.state.paletteValuesConfig();
    const valueOption = this.state.showValuesOption(valuesConfig.showValues);

    this.configGroup = new FormGroup({
      showValues: new FormControl<{ text: string; value: showValuesOption }>(valueOption, {
        nonNullable: true,
      }),
    });

    this.configGroup.valueChanges
      .pipe(
        debounceTime(30),
        distinctUntilChanged((prev, curr) => prev.showValues?.value === curr.showValues?.value),
        startWith(this.configGroup.value)
      )
      .subscribe((value) => {
        const controls = this.configGroup?.controls;
        if (controls && this.configGroup?.valid) {
          this.state.paletteValuesConfigChanged({
            showValues: value.showValues?.value ?? controls.showValues.value.value,
          });
        }
      });
  }
}
