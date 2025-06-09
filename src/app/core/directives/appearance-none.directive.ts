import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-appearance-none], zzAppearanceNone",
})
export class AppearanceNoneDirective {
  @HostBinding("style.appearance")
  get estilos() {
    return "none";
  }
}

@Directive({
  selector: "[zz-appearance-base-select], zzAppearanceBaseSelect",
})
export class AppearanceBaseSelectDirective {
  @HostBinding("style.appearance")
  get estilos() {
    return "base-select";
  }
}

@Directive({
  selector: "[zz-select-none], zzSelectNone",
})
export class SelectNoneDirective {
  @HostBinding("style.userSelect")
  get userSelect() {
    return "none";
  }
  @HostBinding("style.-webkit-user-select")
  get webkitUserSelect() {
    return "none";
  }
}

@Directive({
  selector: "[zz-opacity-50], zzOpacity50",
})
export class Opacity50Directive {
  @HostBinding("style.opacity")
  get opacity() {
    return "0.5";
  }
}

@Directive({
  selector: "[zz-opacity-95], zzOpacity95",
})
export class Opacity95Directive {
  @HostBinding("style.opacity")
  get opacity() {
    return "0.9";
  }
}
