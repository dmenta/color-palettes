export function compassGridColors(darkMode: boolean): CompassGridColors {
  return {
    lines: !darkMode ? "#606060" : "#909090",
    border: !darkMode ? "#505050" : "#a9a9a9",
    preset: !darkMode ? "#999999" : "#888888",
    presetHover: !darkMode ? "#444444" : "#C0C0C0",
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

type CompassGridColors = {
  lines: string;
  border: string;
  preset: string;
  presetHover: string;
  activePreset: string;
};

type CompassArrowColors = {
  lines: string;
  tip: string;
  toe: string;
};
