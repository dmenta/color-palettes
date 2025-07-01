import { Component, inject } from "@angular/core";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "zz-notification",
  imports: [],
  templateUrl: "./notification.component.html",
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
