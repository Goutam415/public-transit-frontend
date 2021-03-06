import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Helpers } from '../utils/helpers/helpers';

@Injectable()
export class ToastNotificationService {
    constructor(private toastr: ToastrService) {}

    showSuccess(message, title = '', options = {}) {
        options = {
            ...options,
            timeOut: 2000,
            positionClass: 'toast-top-right',
        };
        this.toastr.success(message, title, options);
    }

    showError(message, title = '', options = {}) {
        options = {
            ...options,
            timeOut: 2000,
            positionClass: 'toast-top-right',
        };
        let errMessage = 'Unknown error received - unable to fetch message';
        if (typeof message === 'string') {
            errMessage = message;
        } else if (message instanceof HttpErrorResponse) {
            errMessage = Helpers.getErrorMessageFromObject(message);
        } else {
            console.error('Unknown error message received for ToastNotification:', message);
        }
        this.toastr.error(errMessage, title, options);
    }

    showInfo(message, title = '', options = {}) {
        options = {
            ...options,
            positionClass: 'toast-top-right',
        };
        this.toastr.info(message, title, options);
    }

}
