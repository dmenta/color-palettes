import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "palettes", pathMatch: "full" },
  {
    path: "layout",
    title: "Paletas de color",
    loadComponent: () =>
      import("./color/features/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
  {
    path: "palettes",
    title: "Palets de Color",
    loadComponent: () => import("./color/features/layout/layout.component").then((m) => m.LayoutComponent),
  },
];
