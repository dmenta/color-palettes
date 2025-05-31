import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  Optional,
  Output,
  signal,
} from "@angular/core";
import { debounceTime, distinctUntilChanged, filter, map, startWith } from "rxjs";
import { FontStyleAxeMulti } from "../font-style/font-axe-types";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SliderFieldComponent } from "../components/slider-field/slider-field.component";
import { VisibilityButtonComponent } from "../components/visibility-button.component";
import { ResetButtonComponent } from "../components/reset-button.component";
import { ToggleCheckComponent } from "../components/toggle-check.component";

@Component({
  selector: "app-font-variation-control",
  imports: [
    ReactiveFormsModule,
    SliderFieldComponent,
    VisibilityButtonComponent,
    ResetButtonComponent,
    ToggleCheckComponent,
  ],
  templateUrl: "./font-variation-control.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FontVariationControlComponent {
  reset() {
    this.formGroup.reset();
    this.limpio.set(true);
    this.setVisible(true);
  }
  setVisible(visible: boolean) {
    this.visible.set(visible);
  }
  toggleVisible() {
    this.visible.update((current) => !current);
  }
  visible = model(true);

  private _variations: FontStyleAxeMulti | null = null;

  @Input({ required: true }) fieldName: string = "";

  @Input({ required: true }) set variations(value: FontStyleAxeMulti) {
    this._variations = value;
    if (value) {
      this.estadoInicial.set(null);
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

  limpio = signal(true);
  estadoInicial = signal<string | null>(null);

  get control() {
    return this._parentFormGroupDirective?.control.controls[this.fieldName];
  }

  constructor(@Optional() private _parentFormGroupDirective: FormGroupDirective) {}

  private initialize(axe: FontStyleAxeMulti) {
    this.control.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((value) => value === "")
      )
      .subscribe(() => this.reset());

    this.formGroup = this.fb.group(
      axe.parts.reduce((acc, part) => {
        if (part.type === "discreto") {
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

    this.formGroup.valueChanges
      .pipe(
        debounceTime(10),
        startWith(this.formGroup.value),
        map((values) => {
          const valores = this.variations!.parts.map((part) => {
            if (part.type === "discreto") {
              const value = values[part.variation.identifier];
              return `${part.variation.identifier} ${value ? part.range.max : part.range.min}`;
            } else {
              return part.range.defaultValue !== values[part.variation.identifier]
                ? `${part.variation.identifier} ${values[part.variation.identifier]}`
                : null;
            }
          }).filter((v) => v !== null);
          if (valores.length > 0) {
            return `${this.variations?.propiedad.name}: ${valores.join(", ")};`;
          }
          return null;
        })
      )
      .subscribe((style) => {
        this.control.setValue(style ?? "", { emitEvent: true });

        const inicial = this.estadoInicial();
        if (inicial === null) {
          this.estadoInicial.set(style);
          this.setVisible(true);
          this.limpio.set(true);
        } else {
          this.limpio.set(inicial === style);
        }
      });
  }
}
