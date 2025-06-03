import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  Input,
  input,
  NO_ERRORS_SCHEMA,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FocusRingDirective } from "../../directives/focus-ring.directive";
import { DisabledDirective } from "../../directives/disabled.directive";

@Component({
  selector: "app-select",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, FormsModule, FocusRingDirective, DisabledDirective],
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T extends object | string | number, K extends keyof T = keyof T>
  implements ControlValueAccessor
{
  static nextId = 0;
  controlType = "select";

  @ViewChild("valor") valorInput?: ElementRef<HTMLSelectElement>;

  @HostBinding() id = `${this.controlType}-${SelectComponent.nextId++}`;

  @Input("aria-describedby") userAriaDescribedBy?: string;

  items = input<T[]>([]);
  displayKey = input.required<K>();

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  @Input()
  get value() {
    return this._value;
  }
  set value(value: T | null) {
    this._value = value;
    if (!this.touched) {
      this.writeValue(value);
    }
  }
  private _value: T | null = null;
  _renderer: Renderer2 = inject(Renderer2);

  onValueChange(event: Event) {
    const indice = (event.target as HTMLSelectElement).selectedIndex;

    this.value = this.items()[indice];

    this.onChange(this._value);
    event.stopPropagation();
  }

  focused = false;
  touched = false;

  constructor(public _elementRef: ElementRef<HTMLElement>) {}

  onFocusIn(_event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this._elementRef.nativeElement.focus();
    }
  }
  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched?.call(this);
    }
  }

  writeValue(value: T | null): void {
    const indice = this.items().findIndex((item) => item === value);
    if (indice > -1) {
      const selectedOption = this.valorInput?.nativeElement.querySelector(`option:nth-of-type(${indice + 1})`);
      this._renderer.setProperty(selectedOption, "selected", "selected");
    }
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, "disabled", isDisabled);
  }

  onChange: (value: any) => void = (value: any) => {};
  onTouched?: () => void = () => {};
}
