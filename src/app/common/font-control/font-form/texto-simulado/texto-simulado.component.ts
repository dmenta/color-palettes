import { Component, input } from "@angular/core";

@Component({
  selector: "app-texto-simulado",
  templateUrl: "./texto-simulado.component.html",
})
export class TextoSimuladoComponent {
  estilos = input<string | null>(null);
}
