import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";

@Component({
  selector: "button[zz-icon-toggle-button]",
  template: ` {{ iconName() }} `,
  host: {
    "(click)": "onClick($event)",
    class: "icon-button",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconToggleButtonComponent {
  value = model<boolean>(true);
  toggle = output<boolean>();

  trueIcon = input("radio_button_checked", {
    transform: (value?: string) => value?.trim() || "radio_button_checked",
  });
  falseIcon = input("radio_button_unchecked", {
    transform: (value?: string) => value?.trim() || "radio_button_unchecked",
  });

  iconName = computed(() => (this.value() ? this.trueIcon() : this.falseIcon()));
  onClick(event: MouseEvent) {
    this.value.update((currentValue) => !currentValue);
    this.toggle.emit(this.value());
    event.stopPropagation();
  }
}
