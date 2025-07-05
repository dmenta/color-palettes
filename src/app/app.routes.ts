import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    title: "Color Palettes",
    loadComponent: () => import("./features/palettes/palettes.component").then((m) => m.PalettesComponent),
  },

  { path: "palettes", redirectTo: "", pathMatch: "full" },

  {
    path: "test",
    title: "Test",
    loadComponent: () => import("./features/test-col/test-col.component").then((m) => m.BezierGradientComponent),
  },

  { path: "**", redirectTo: "" },
];
