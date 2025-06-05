import { fraunces } from "../fonts/fraunces";
import { merriweather } from "../fonts/merriweather";
import { notoSans } from "../fonts/noto-sans";
import { notoSerif } from "../fonts/noto-serif";
import { nunitoSans } from "../fonts/nunito-sans";
import { roboto } from "../fonts/roboto";
import { robotoFlex } from "../fonts/roboto-flex";
import { FontDefinition } from "./font-definition";
import { createFontFamily } from "./font-family";

const fontDefinitons: FontDefinition[] = [robotoFlex, roboto, nunitoSans, fraunces, merriweather, notoSerif, notoSans];

export const fontFamilies = createFontFamily(fontDefinitons.sort((a, b) => a.name.localeCompare(b.name)));
