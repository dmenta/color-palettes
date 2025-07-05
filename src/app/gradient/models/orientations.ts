export const orientationsDefinitions = [
  { value: "to right", icon: "&#x2192;", class: "rotate-90" },
  { value: "to right bottom", icon: "&#x2198;", class: "rotate-135" },
  { value: "to bottom", icon: "&#x2193;", class: "rotate-180" },
  { value: "to left bottom", icon: "&#x2199;", class: "-rotate-135" },
  { value: "to left", icon: "&#x2190;", class: "-rotate-90" },
  { value: "to left top", icon: "&#x2196;", class: "-rotate-45" },
  { value: "to top", icon: "&#x2191;", class: "rotate-0" },
  { value: "to right top", icon: "&#x2197;", class: "rotate-45" },
];

export type GradientOrientation =
  | "to right"
  | "to right bottom"
  | "to bottom"
  | "to left bottom"
  | "to left"
  | "to left top"
  | "to top"
  | "to right top";
