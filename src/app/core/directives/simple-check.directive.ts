import { Directive } from "@angular/core";

@Directive({
  selector: "[type=checkbox][zz-simple-check]",
  host: {
    class: `appearance-none text-inherit
    inline-block min-w-4 w-4 h-4 p-1
    cursor-pointer
    bg-white dark:bg-gris-900
    rounded-[25%] border-[2px] border-white dark:border-gris-900
    outline-[1px] outline-gris-500 dark:outline-gris-400
    focus:ring-[2px] focus:ring-gris-900 dark:focus:ring-gris-100
    transition-all duration-100
    checked:bg-sky-400 dark:checked:bg-sky-600`,
  },
})
export class SimpleCheckDirective {}
