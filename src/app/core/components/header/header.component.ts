import { ChangeDetectionStrategy, Component, ElementRef, signal, ViewChild } from "@angular/core";
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
  hasProjectedContent = signal<boolean>(false);

  ngAfterViewInit() {
    // Check if there are any child elements (excluding comments/text nodes if preferred)
    console.log("Content Wrapper Children:", this.contentWrapper.nativeElement.children);
    this.hasProjectedContent.set(this.contentWrapper.nativeElement.children.length > 0);
    console.log("Has Projected Content:", this.hasProjectedContent);
  }
}
