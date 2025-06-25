import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "palettes", pathMatch: "full" },
  {
    path: "font",
    title: "Fuentes variables",
    loadComponent: () => import("./font-control/display/font-display.component").then((m) => m.FontDisplayComponent),
  },
  {
    path: "palettes",
    title: "Paletas de color",
    loadComponent: () =>
      import("./color/features/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
];
