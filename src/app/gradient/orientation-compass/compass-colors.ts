export function compassGridColors(darkMode: boolean): CompassGridColors {
  return {
    lines: !darkMode ? "#606060" : "#909090",
    border: !darkMode ? "#505050" : "#a0a0a0",
    preset: !darkMode ? "#777777" : "#888888",
    presetHover: !darkMode ? "#333333" : "#C0C0C0",
    activePreset: !darkMode ? "#000000" : "#ffffff",
  };
}

export function compassArrowColors(darkMode: boolean): CompassArrowColors {
  return {
    lines: !darkMode ? "#202020" : "#cccccc",
    tip: !darkMode ? "oklch(0.634 0.254 18)" : "oklch(0.355 0.146 29)",
    toe: !darkMode ? "#d0d0d0" : "gray",
  };
}

export type CompassGridColors = {
  lines: string;
  border: string;
  preset: string;
  presetHover: string;
  activePreset: string;
};

export type CompassArrowColors = {
  lines: string;
  tip: string;
  toe: string;
};
