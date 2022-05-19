import { Component } from '@angular/core';
import { MessageService } from 'src/app/core/services/messages-toasts/message.service';

@Component({
  selector: 'ts-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(public toastService: MessageService) {}
}
