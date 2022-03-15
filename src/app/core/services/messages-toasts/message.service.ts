import { Injectable } from '@angular/core';

export type Toast = {
  header: string;
  body: string;
  classname?: string;
  delay?: Number;
};

export enum TOASTCOLOR {
  STANDARD,
  SUCCESS,
  WARNING,
  DANGER,
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  toasts: Toast[] = [];

  showToast(toast: Toast, color: TOASTCOLOR = TOASTCOLOR.STANDARD) {
    switch (color) {
      case TOASTCOLOR.SUCCESS:
        toast.classname = 'bg-success text-light';
        break;
      case TOASTCOLOR.WARNING:
        toast.classname = 'bg-warning text-light';
        break;
      case TOASTCOLOR.DANGER:
        toast.classname = 'bg-danger text-light';
        break;
      default:
        toast.classname = 'bg-primary text-light';
        break;
    }

    toast.delay = 5000;
    this.toasts.push(toast);
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }

  constructor() {}
}
