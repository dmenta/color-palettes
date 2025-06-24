import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "palettes", pathMatch: "full" },
  {
    path: "font",
    loadComponent: () => import("./font-control/display/font-display.component").then((m) => m.FontDisplayComponent),
  },
  {
    path: "palettes",
    loadComponent: () =>
      import("./color/components/color-palette/color-palette.component").then((m) => m.ColorPaletteComponent),
  },
  {
    path: "colors",
    loadComponent: () =>
      import("./color/components/color-sampler/color-sampler.component").then((m) => m.ColorSamplerComponent),
  },
];
