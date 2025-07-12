export type GradientDefinition = {
  stops: GradientStop[];
  gradient: string;
  darkMode: boolean;
  gradientRGB: string;
  rgbStops: GradientStop[];
};

export type GradientStop = {
  offset: number;
  color: string;
};
