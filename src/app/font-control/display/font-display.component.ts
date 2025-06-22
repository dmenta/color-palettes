import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FlexDirective, BlockDirective } from "../../core/directives/display.directive";
import { TransitionDefaultDirective } from "../../core/directives/transition.directive";
import { WidthFullDirective } from "../../core/directives/width.directive";
import { DarkModeService } from "../../core/service/dark-mode.service";
import { TextoSimuladoComponent } from "../font-form/texto-simulado/texto-simulado.component";
import { FontSamplerComponent } from "../font-sampler/font-sampler.component";

@Component({
  selector: "zz-font-display",
  templateUrl: "./font-display.component.html",
  imports: [
    CommonModule,
    FormsModule,
    FontSamplerComponent,
    TextoSimuladoComponent,
    WidthFullDirective,
    FlexDirective,
    TransitionDefaultDirective,
    BlockDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontDisplayComponent {
  darkModeService = inject(DarkModeService);

  estilo = signal<string | undefined>(undefined);
  fontName = signal<string | undefined>(undefined);
}
