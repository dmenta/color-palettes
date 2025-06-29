import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";
import { IconButtonDirective } from "../../directives/icon-button.directive";
import { IconDirective } from "../../directives/icon.directive";

@Component({
  selector: "button[zz-icon-toggle-button]",
  imports: [IconDirective],
  template: ` <span zz-icon>{{ iconName() }}</span> `,
  host: {
    "(click)": "onClick($event)",
  },
  hostDirectives: [IconButtonDirective],
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
