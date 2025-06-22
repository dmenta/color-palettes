import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "font", pathMatch: "full" },
  {
    path: "font",
    loadComponent: () => import("./font-control/display/font-display.component").then((m) => m.FontDisplayComponent),
  },
  {
    path: "colors",
    loadComponent: () =>
      import("./color/components/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
];
