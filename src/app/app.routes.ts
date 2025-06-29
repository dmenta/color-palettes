import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "palettes", pathMatch: "full" },
  {
    path: "palettes",
    title: "Color Palettes",
    loadComponent: () => import("./color/features/layout/layout.component").then((m) => m.LayoutComponent),
  },
];
