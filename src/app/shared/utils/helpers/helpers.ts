import { HttpErrorResponse } from '@angular/common/http';

declare let $: any;

export class Helpers {
    static getErrorMessageFromObject(errorResponse: HttpErrorResponse): string {
        const err = errorResponse?.error?.error || null;
        if (err) {
            return errorResponse.error.error.message;
        }

        return '';
    }
}
