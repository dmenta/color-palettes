import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "layout", pathMatch: "full" },
  {
    path: "palettes",
    title: "Paletas de color",
    loadComponent: () =>
      import("./color/features/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
  {
    path: "layout",
    title: "Palets de Color - Inicio",
    loadComponent: () => import("./color/features/layout/layout.component").then((m) => m.LayoutComponent),
  },
];
