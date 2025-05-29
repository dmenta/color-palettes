export type fontVariation = {
  identifier: variationIdentifier;
  caption: string;
};

export type fontVariationDefinition = {
  variation: variationIdentifier;
  min: number;
  max: number;
  initialValue: number;
  step: number;
  stops?: number[];
};

export const fontVariations = {
  width: "'wdth'" as variationIdentifier,
  slant: "'slnt'" as variationIdentifier,
  grade: "'GRAD'" as variationIdentifier,
  lowercase: "'YTLC'" as variationIdentifier,
  uppercase: "'YTUC'" as variationIdentifier,
  ascending: "'YTAS'" as variationIdentifier,
  descending: "'YTDE'" as variationIdentifier,
  thinStroke: "'YOPQ'" as variationIdentifier,
  thickStroke: "'XOPQ'" as variationIdentifier,
  counterWidth: "'XTRA'" as variationIdentifier,
  figureHeight: "'YTFI'" as variationIdentifier,
};

export type variationIdentifier =
  | "'wdth'"
  | "'slnt'"
  | "'GRAD'"
  | "'YTLC'"
  | "'YTUC'"
  | "'YTAS'"
  | "'YTDE'"
  | "'YOPQ'"
  | "'XOPQ'"
  | "'XTRA'"
  | "'YTFI'";
