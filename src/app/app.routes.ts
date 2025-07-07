import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "palettes",
    title: "Colorina - Palettes",
    loadComponent: () => import("./features/palettes/palettes.component").then((m) => m.PalettesComponent),
  },

  { path: "palettes", redirectTo: "", pathMatch: "full" },

  {
    path: "",
    title: "Colorina - Gradients",
    loadComponent: () =>
      import("./features/gradients/bezier-gradient.component").then((m) => m.BezierGradientComponent),
  },

  { path: "**", redirectTo: "" },
];
