import { fraunces } from "../fonts/fraunces";
import { handjet } from "../fonts/handjet";
import { materialSymbols } from "../fonts/material-symbols";
import { merriweather } from "../fonts/merriweather";
import { notoSans } from "../fonts/noto-sans";
import { notoSerif } from "../fonts/noto-serif";
import { nunitoSans } from "../fonts/nunito-sans";
import { playfair } from "../fonts/playfair";
import { recursive } from "../fonts/recursive";
import { roboto } from "../fonts/roboto";
import { robotoFlex } from "../fonts/roboto-flex";
import { FontDefinition } from "./font-definition";
import { createFontFamily } from "./font-family";

const fontDefinitons: FontDefinition[] = [
  robotoFlex,
  roboto,
  nunitoSans,
  fraunces,
  merriweather,
  notoSerif,
  notoSans,
  playfair,
  handjet,
  materialSymbols,
  recursive,
];

export const fontFamilies = createFontFamily(fontDefinitons.sort((a, b) => a.name.localeCompare(b.name)));
