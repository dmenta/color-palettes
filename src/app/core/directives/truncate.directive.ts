import { Directive, HostBinding } from "@angular/core";
import { OverflowHiddenDirective } from "./overflow.directive";

@Directive({
  selector: "[zz-truncate], zzTruncate",
  hostDirectives: [OverflowHiddenDirective],
})
export class TruncateDirective {
  @HostBinding("style.textOverflow")
  get estilosTextOverflow() {
    return "ellipsis";
  }
  @HostBinding("style.whiteSpace")
  get estilosWhiteSpace() {
    return "nowrap";
  }
}
