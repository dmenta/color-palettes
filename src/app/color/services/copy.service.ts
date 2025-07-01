import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class CopyService {
  private notificationService = inject(NotificationService);

  copy(value: string, message?: string) {
    navigator.clipboard.writeText(value);
    this.notificationService.success(message ?? "Copied to clipboard!");
  }
}
