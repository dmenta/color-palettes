import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "palettes", pathMatch: "full" },
  {
    path: "palettes",
    title: "Paletas de color",
    loadComponent: () =>
      import("./color/features/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
  {
    path: "test",
    title: "Test de color",
    loadComponent: () => import("./color/components/test/test.component").then((m) => m.TestComponent),
  },
];
