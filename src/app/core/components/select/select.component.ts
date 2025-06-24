import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
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
import { SelectDirective } from "./select.directive";

@Component({
  selector: "zz-select",
  schemas: [NO_ERRORS_SCHEMA],
  imports: [CommonModule, FormsModule, SelectDirective],
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.css"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T extends object | string | number, K extends keyof T = keyof T>
  implements ControlValueAccessor
{
  trackValue(index: number, item: T) {
    return index + "-" + item[this.displayKey()].toString();
  }
  static nextId = 0;
  controlType = "select";

  @ViewChild("valor") valorInput?: ElementRef<HTMLSelectElement>;

  @HostBinding() id = `${this.controlType}-${SelectComponent.nextId++}`;

  @Input("aria-describedby") userAriaDescribedBy?: string;

  items = input<T[]>([]);
  displayKey = input.required<K>();

  upperCase = input(false);

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

  touched = false;

  constructor(public _elementRef: ElementRef<HTMLElement>) {}

  onFocusOut(_event: FocusEvent) {
    this.touched = true;
    this.onTouched?.call(this);
  }

  writeValue(value: T | null): void {
    if (value) {
      const valueKey = value[this.displayKey()];
      let indice = this.items().findIndex((item) => item[this.displayKey()] === valueKey);
      indice = indice === -1 ? 0 : indice;
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

  onChange: (value: any) => void = (_value: any) => {};
  onTouched?: () => void = () => {};
}
