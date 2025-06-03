import { Component, computed, inject, input, Input, output, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CollapsiblePanelComponent } from "../../../../../core/components/collapsible-panel/collapsible-panel.component";
import { ShowHideComponent } from "../../../../../core/components/show-hide/show-hide.component";
import { ToggleCheckComponent } from "../../../../../core/components/toggle-check/toggle-check.component";
import { SliderFieldComponent } from "../../../../../core/components/slider-field/slider-field.component";
import { FontFormTitleComponent } from "../font-form-title/font-form-title.component";
import { SingleValuePropertyConfiguration } from "../../font-configuration/singlevalue-property";
import { tap, startWith, map } from "rxjs";

@Component({
  selector: "app-font-singles-form",
  imports: [
    ReactiveFormsModule,
    CollapsiblePanelComponent,
    ShowHideComponent,
    ToggleCheckComponent,
    SliderFieldComponent,
    FontFormTitleComponent,
  ],
  templateUrl: "./font-singles-form.componente.html",
})
export class SingleValuePropertiesFormComponent {
  title = input<string>("");
  private _propertyConfigs: SingleValuePropertyConfiguration[] = [];
  @Input() set propertyConfigs(value: SingleValuePropertyConfiguration[]) {
    this._propertyConfigs = value;
    if (value) {
      this.initialize(value);
    }
  }
  get propertyConfigs(): SingleValuePropertyConfiguration[] {
    return this._propertyConfigs;
  }

  fb: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({});

  @Input() labelLength?: number = 5;
  @Input() valueLength?: number = 4;

  estadoInicial = signal<string | null>(null);
  estadoActual = signal<string | null>(null);

  modificado = computed(() => {
    const inicial = this.estadoInicial();
    const actual = this.estadoActual();
    if (inicial === null || actual === null) {
      return false;
    }

    return inicial !== actual;
  });

  reset() {
    this.formGroup.reset();
  }

  styleChanged = output<string[]>();
  visible = signal(true);
  collapsed = signal(false);

  private initialize(configs: SingleValuePropertyConfiguration[]) {
    this.estadoActual.set(null);
    this.estadoInicial.set(null);

    this.formGroup = this.fb.group(
      configs.reduce((acc, config) => {
        if (config.type === "boolean") {
          acc[config.name] = this.fb.nonNullable.control(config.defaultValue);
          return acc;
        }
        if (config.type === "range") {
          acc[config.name] = this.fb.nonNullable.control(config.defaultValue);
        }
        return acc;
      }, {} as { [key: string]: FormControl<number> | FormControl<boolean> })
    );

    this.estadoInicial.set(JSON.stringify(this.formGroup.value));

    this.formGroup.valueChanges
      .pipe(
        tap((values) => {
          this.estadoActual.set(JSON.stringify(values));
        }),
        startWith(this.formGroup.value),
        map((values) => this.propertyConfigs.map((config) => config.propertyValue(values)).filter((v) => v !== null))
      )
      .subscribe((value) => {
        this.styleChanged.emit(value);
      });
  }
}
