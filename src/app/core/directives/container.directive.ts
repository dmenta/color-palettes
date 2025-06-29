import { Directive } from "@angular/core";
import { ContainerBackgroundDirective } from "./background.directive";
import { BorderDirective } from "./border.directive";
import { BlockDirective } from "./display.directive";

@Directive({
  selector: "[zz-container]",
  hostDirectives: [
    BlockDirective,
    ContainerBackgroundDirective,
    {
      directive: BorderDirective,
      inputs: ["zz-border:zzBorderSize", "zz-border-color:zzBorderColor", "zz-border-style:zzBorderStyle"],
    },
  ],
})
export class ContainerDirective {}
