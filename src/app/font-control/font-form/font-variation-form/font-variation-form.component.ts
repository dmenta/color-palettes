import { ChangeDetectionStrategy, Component, computed, inject, Input, output, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CollapsiblePanelComponent } from "../../../core/components/collapsible-panel/collapsible-panel.component";
import { CollapseVerticalDirective } from "../../../core/directives/collapse-vertical.directive";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { FontFormTitleComponent } from "../font-form-title/font-form-title.component";
import { distinctUntilChanged, map, startWith, tap } from "rxjs";
import { MultivaluePropertyConfiguration } from "../../font-configuration/models/multivalue-property";
import { PanelDirective } from "../../../core/directives/containers/panel.directive";

@Component({
  selector: "zz-font-variation-form",
  imports: [
    ReactiveFormsModule,
    CollapsiblePanelComponent,
    CollapseVerticalDirective,
    ToggleCheckComponent,
    SliderFieldComponent,
    FontFormTitleComponent,
    PanelDirective,
  ],
  templateUrl: "./font-variation-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiValuePropertyFormComponent {
  private _multiValueConfig: MultivaluePropertyConfiguration | null = null;
  @Input() set multiValueConfig(value: MultivaluePropertyConfiguration | null) {
    this._multiValueConfig = value;
    if (value) {
      this.initialize(value);
    }
  }
  get multiValueConfig(): MultivaluePropertyConfiguration | null {
    return this._multiValueConfig;
  }

  fb: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({});

  @Input() labelLength?: number = 5;
  @Input() valueLength?: number = 4;

  estadoInicial = signal<string | undefined>(undefined);
  estadoActual = signal<string | undefined>(undefined);

  modificado = computed(() => {
    const inicial = this.estadoInicial();
    const actual = this.estadoActual();
    if (inicial === undefined || actual === undefined) {
      return false;
    }

    return inicial !== actual;
  });

  reset() {
    this.formGroup.reset();
  }

  styleChanged = output<string | undefined>();
  visible = signal(true);
  collapsed = signal(false);

  private initialize(multiPartConfig: MultivaluePropertyConfiguration) {
    this.estadoActual.set(undefined);
    this.estadoInicial.set(undefined);

    this.formGroup = this.fb.group(
      multiPartConfig.multiValueParts.reduce((acc, config) => {
        if (config.type === "boolean") {
          acc[config.identifier] = this.fb.nonNullable.control(config.defaultValue);
          return acc;
        }
        if (config.type === "range") {
          acc[config.identifier] = this.fb.nonNullable.control(config.defaultValue ?? config.min);
        }
        return acc;
      }, {} as { [key: string]: FormControl<number> | FormControl<boolean> })
    );

    this.estadoInicial.set(JSON.stringify(this.formGroup.value));

    this.formGroup.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((values) => {
          this.estadoActual.set(JSON.stringify(values));
        }),
        startWith(this.formGroup.value),
        map((values) => this.multiValueConfig!.propertyValue(values))
      )
      .subscribe((value) => {
        this.styleChanged.emit(value);
      });
  }
}
