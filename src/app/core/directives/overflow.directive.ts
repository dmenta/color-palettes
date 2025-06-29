import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-overflow-hidden], zzOverflowHidden",
})
export class OverflowHiddenDirective {
  @HostBinding("style.overflow")
  get estilos() {
    return "hidden";
  }
}
@Directive({
  selector: "[zz-overflow-visible], zzOverflowVisible",
})
export class OverflowVisibleDirective {
  @HostBinding("style.overflow")
  get estilos() {
    return "visible";
  }
}

@Directive({
  selector: "[zz-overflow-y-hidden], zzOverflowYHidden",
})
export class OverflowYHiddenDirective {
  @HostBinding("style.overflowY")
  get estilos() {
    return "hidden";
  }
}
