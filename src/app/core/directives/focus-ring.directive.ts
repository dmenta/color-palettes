import { computed, Directive, input } from "@angular/core";

@Directive({
  selector: "[zz-focus-ring], zzFocusRing",
  host: {
    "[class]": "clases()",
  },
})
export class FocusRingDirective {
  enabled = input(undefined, { alias: "show-focus-ring", transform: (value: boolean | undefined) => value ?? true });

  clases = computed(() => {
    return this.enabled()
      ? `
          group-focus-within:ring-2 group-focus-within:ring-offset-0
          ring-gris-600/50 outline-none  
          dark:ring-gris-300/60
          focus:ring-2 focus:ring-offset-0
        `
      : "";
  });
}
