import { Directive } from "@angular/core";
import { RoundedDirective } from "../rounded.directive";
import { ContainerDirective } from "./container.directive";

@Directive({
  selector: "[zz-rounded-container]",
  hostDirectives: [
    { directive: ContainerDirective },
    {
      directive: RoundedDirective,
      inputs: ["zz-rounded:zzRoundedSize"],
    },
  ],
})
export class RoundedContainerDirective {}
