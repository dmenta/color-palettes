import { ChangeDetectionStrategy, Component, computed, inject, model, output } from "@angular/core";
import { DarkModeService } from "../../service/dark-mode.service";

@Component({
  selector: "zz-dark-mode-toggle",
  templateUrl: "./dark-mode-toggle.component.html",
  host: {
    class: "h-8 inline-block w-full",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent {
  darkModeService = inject(DarkModeService);

  value = model<boolean>(true);
  toggle = output<boolean>();

  falseIcon = "dark_mode";
  trueIcon = "light_mode";

  iconName = computed(() => (this.value() ? this.trueIcon : this.falseIcon));

  modeText = computed(() => (this.value() ? "Light Mode" : "Dark Mode"));
  onClick(_event: MouseEvent) {
    this.value.update((currentValue) => !currentValue);
    this.toggle.emit(this.value());

    this.darkModeService.setDarkMode(this.value());
  }

  ngOnInit() {
    console.log("Dark Mode Toggle Initialized");
    this.value.set(this.darkModeService.darkMode());
    this.toggle.emit(this.value());
  }
}
