import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { DarkModeToggleComponent } from "../dark-mode-toggle/dark-mode-toggle.component";
import { MarcaComponent } from "../marca/marca.component";

@Component({
  selector: "zz-header",
  imports: [DarkModeToggleComponent, MarcaComponent],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @ViewChild("contentWrapper") contentWrapper!: ElementRef;
  hasProjectedContent: boolean = false;

  ngAfterViewInit() {
    this.hasProjectedContent = this.contentWrapper.nativeElement.children.length > 0;
  }
}
