import { Component, ElementRef, forwardRef, HostBinding, inject, Input, Renderer2, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-toggle-check",
  imports: [ReactiveFormsModule],
  templateUrl: "./toggle-check.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleCheckComponent),
      multi: true,
    },
  ],
})
export class ToggleCheckComponent implements ControlValueAccessor {
  static nextId = 0;
  controlType = "toggle-check";

  @ViewChild("valor") valorInput?: ElementRef<HTMLInputElement>;

  @HostBinding() id = `${this.controlType}-${ToggleCheckComponent.nextId++}`;

  @Input("aria-describedby") userAriaDescribedBy?: string;
  @Input() before: boolean = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  @Input()
  get label() {
    return this._label;
  }
  set label(value: string) {
    this._label = value;
  }

  private _label: string = "";

  @Input()
  get value(): boolean {
    return this._value;
  }
  set value(valor: boolean) {
    this._value = valor;
  }
  private _value: boolean = false;

  focused = false;
  touched = false;

  _renderer: Renderer2 = inject(Renderer2);

  writeValue(value: boolean): void {
    this._renderer.setProperty(this.valorInput?.nativeElement, "checked", value);
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
  onTouched: () => void = () => {};

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
      this.onTouched();
    }
  }

  clickCheckbox(event: MouseEvent) {
    this._value = (event.target as HTMLInputElement).checked;
    this.onChange(this._value);

    event.stopPropagation();
  }

  constructor(public _elementRef: ElementRef<HTMLElement>) {}
}
