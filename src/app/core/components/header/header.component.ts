import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from "@angular/core";
import { MarcaComponent } from "../marca/marca.component";
import { MenuComponent } from "../menu/menu.component";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: "zz-header",
  imports: [MarcaComponent, MenuComponent, RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @ViewChild("contentWrapper") contentWrapper!: ElementRef;
  hasProjectedContent = signal<boolean>(false);

  ngAfterViewInit() {
    this.hasProjectedContent.set(this.contentWrapper.nativeElement.children.length > 0);
  }
}
