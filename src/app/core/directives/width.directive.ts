import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-width-full], zzWidthFull",
})
export class WidthFullDirective {
  @HostBinding("style.width")
  get width() {
    return "100%";
  }
}
