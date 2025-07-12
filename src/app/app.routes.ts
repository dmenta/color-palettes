import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "palettes",
    title: "Colorina - Palettes",
    loadComponent: () => import("./features/palettes/palettes.component").then((m) => m.PalettesComponent),
  },

  { path: "", redirectTo: "/palettes", pathMatch: "full" },

  {
    path: "gradients",
    title: "Colorina - Gradients",
    loadComponent: () =>
      import("./features/gradients/bezier-gradient.component").then((m) => m.BezierGradientComponent),
  },

  {
    path: "gradient3",
    title: "Colorina - Double Gradients",
    loadComponent: () =>
      import("./features/double-bezier-gradient/double-bezier-gradient.component").then(
        (m) => m.DoubleBezierGradientComponent
      ),
  },

  { path: "**", redirectTo: "" },
];
