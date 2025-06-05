import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[zz-disabled], zzDisabled",
})
export class DisabledDirective {
  state = input(false, {
    alias: "zz-disabled",
  });

  @HostBinding("style.opacity")
  get opacity(): string | undefined {
    return this.state() ? "0.5" : undefined;
  }

  @HostBinding("style.cursor")
  get cursor(): string | undefined {
    return this.state() ? "not-allowed" : undefined;
  }

  @HostBinding("style.userSelect")
  get userSelect(): string | undefined {
    return this.state() ? "none" : undefined;
  }

  @HostBinding("style.shadow")
  get shadow(): string | undefined {
    return this.state() ? "0 0 #0000" : undefined;
  }

  @HostBinding("attr.disabled")
  get isDisabled(): string | undefined {
    return this.state().toString() === "true" ? "" : undefined;
  }
}
