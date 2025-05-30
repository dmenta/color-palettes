import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Optional, Output } from "@angular/core";
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
import { SliderFieldComponent } from "../slider-field/slider-field.component";

@Component({
  selector: "app-font-variation-control",
  imports: [ReactiveFormsModule, SliderFieldComponent],
  templateUrl: "./font-variation-control.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FontVariationControlComponent {
  reset() {
    this.formGroup.reset();
    this.control.reset();
  }
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
  @Output() styleChanged = new EventEmitter<string>();

  fb: FormBuilder = inject(FormBuilder);
  formGroup: FormGroup<{ [key: string]: FormControl<number> }> = new FormGroup<{ [key: string]: FormControl<number> }>(
    {}
  );

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
        acc[part.variation.identifier] = this.fb.control<number>(part.range.defaultValue, {
          nonNullable: true,
          validators: [Validators.min(part.range.min), Validators.max(part.range.max)],
        });
        return acc;
      }, {} as { [key: string]: FormControl<number> })
    );

    this.formGroup.valueChanges
      .pipe(
        debounceTime(10),
        startWith(this.formGroup.value),
        map((values) => {
          const valores = this.variations!.parts.map((part) =>
            part.range.defaultValue !== values[part.variation.identifier]
              ? `${part.variation.identifier} ${values[part.variation.identifier]}`
              : null
          ).filter((v) => v !== null);
          if (valores.length > 0) {
            return `${this.variations?.propiedad.name}: ${valores.join(", ")};`;
          }
          return null;
        })
      )
      .subscribe((style) => {
        this.control.setValue(style ?? "", { emitEvent: true });
        // this.styleChanged.emit(style ?? "");
      });
  }
}
