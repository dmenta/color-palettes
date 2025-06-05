import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "[zz-transition-all], zzTransitionAll",
})
export class TransitionAllDirective {
  @HostBinding("style.transitionProperty")
  get userSelect() {
    return "all";
  }
  /*
  .transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) ;
  transition-duration:  150ms 
 );
}*/
}

@Directive({
  selector: "[zz-transition-timing], zzTransitionTiming",
})
export class TimingFunctionDirective {
  @HostBinding("style.transitionTimingFunction")
  get timing() {
    return "cubic-bezier(0.4, 0, 0.2, 1)";
  }
}

@Directive({
  selector: "[zz-transition-duration-150], zzTransitionDuration150",
})
export class Duration150Directive {
  @HostBinding("style.transitionDuration")
  get userSelect() {
    return "150ms";
  }
}

@Directive({
  selector: "[zz-transition-duration-100], zzTransitionDuration100",
})
export class Duration100Directive {
  @HostBinding("style.transitionDuration")
  get userSelect() {
    return "100ms";
  }
}

@Directive({
  selector: "[zz-transition-default], zzTransitionDefault",
  hostDirectives: [TransitionAllDirective, TimingFunctionDirective, Duration150Directive],
})
export class TransitionDefaultDirective {}
