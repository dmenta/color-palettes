import { Directive } from "@angular/core";
import { BaseButtonDirective } from "./button.directive";

@Directive({
  selector: "[app-normal-button]",
  host: { class: "inline-block  h-10 px-4 py-2" },
  hostDirectives: [BaseButtonDirective],
})
export class NormalButtonDirective {}
