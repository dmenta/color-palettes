import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    title: "Color Palettes",
    loadComponent: () => import("./features/palettes/palettes.component").then((m) => m.PalettesComponent),
  },

  { path: "palettes", redirectTo: "", pathMatch: "full" },

  { path: "**", redirectTo: "" },
];
