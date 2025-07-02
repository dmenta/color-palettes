import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotificationService } from "../../service/notification.service";

@Component({
  selector: "zz-notification",
  imports: [],
  templateUrl: "./notification.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
