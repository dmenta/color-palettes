import { Component, computed, inject, Input, model, Optional, signal } from "@angular/core";
import { distinctUntilChanged, filter, map, startWith, tap } from "rxjs";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SliderFieldComponent } from "../../../core/components/slider-field/slider-field.component";
import { ToggleCheckComponent } from "../../../core/components/toggle-check/toggle-check.component";
import { IconToggleButtonComponent } from "../../../core/components/buttons/icon-toggle-button.component";
import { IconButtonComponent } from "../../../core/components/buttons/icon-button.component";
import { ShowHideComponent } from "../../../core/components/show-hide/show-hide.component";
import { FontStyleAxeMulti } from "../font-style/font-axe-types";
import { CollapsiblePanelComponent } from "../../../core/components/collapsible-panel/collapsible-panel.component";

@Component({
  selector: "app-font-variation-control",
  imports: [
    ReactiveFormsModule,
    SliderFieldComponent,
    ToggleCheckComponent,
    CollapsiblePanelComponent,
    IconToggleButtonComponent,
    IconButtonComponent,
    ShowHideComponent,
  ],
  templateUrl: "./font-variation-control.component.html",
})
export class FontVariationControlComponent {
  estadoInicial = signal<string | null>(null);
  estadoActual = signal<string | null>(null);

  sinCambios = computed(() => {
    const inicial = this.estadoInicial();
    const actual = this.estadoActual();
    if (inicial === null || actual === null) {
      return true;
    }
    return inicial === actual;
  });

  reset() {
    this.formGroup.reset();
    this.setVisible(true);
  }
  setVisible(visible: boolean) {
    this.visible.set(visible);
  }
  toggleVisible() {
    this.visible.update((current) => !current);
  }

  collapsed = signal(false);
  visible = model(true);

  private _variations: FontStyleAxeMulti | null = null;

  @Input({ required: true }) fieldName: string = "";

  @Input({ required: true }) set variations(value: FontStyleAxeMulti) {
    this._variations = value;
    if (value) {
      this.initialize(value);
    }
  }
  get variations(): FontStyleAxeMulti | null {
    return this._variations;
  }

  @Input() labelLength?: number = 5;
  @Input() valueLength?: number = 4;

  fb: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({});

  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}

  private initialize(axe: FontStyleAxeMulti) {
    this.estadoActual.set(null);
    this.estadoInicial.set(null);

    this.control.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value) => value === "")
      )
      .subscribe(() => this.reset());

    this.formGroup = this.fb.group(
      axe.parts.reduce((acc, part) => {
        if (part.type === "boolean") {
          acc[part.variation.identifier] = this.fb.control(part.range.defaultValue, {
            nonNullable: true,
          });
          return acc;
        }
        acc[part.variation.identifier] = this.fb.control<number>(part.range.defaultValue, {
          nonNullable: true,
          validators: [Validators.min(part.range.min), Validators.max(part.range.max)],
        });
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
        map((values) => {
          const valores = this.variations!.parts.map((part) => {
            if (part.type === "boolean") {
              const value = values[part.variation.identifier];
              return `${part.variation.identifier} ${value ? part.range.max : part.range.min}`;
            } else {
              return part.range.defaultValue !== values[part.variation.identifier]
                ? `${part.variation.identifier} ${values[part.variation.identifier]}`
                : null;
            }
          }).filter((v) => v !== null);
          if (valores.length > 0) {
            return `${this.variations?.name}: ${valores.join(", ")};`;
          }
          return null;
        })
      )
      .subscribe((style) => {
        this.control.setValue(style ?? "", { emitEvent: true });
      });
  }
}
