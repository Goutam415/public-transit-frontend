import { ActivatedRoute, Router } from '@angular/router';

export class RouterHelper {
    /**
     * Soft Reload the page to refresh the data
     */
    static reloadPage(router: Router, route: ActivatedRoute) {
        let { url } = router;
        router.navigate(['../'], { relativeTo: route, skipLocationChange: true }).then(() => {
            setTimeout(() => {
                router.navigateByUrl(url);
            }, 0);
        });
    }
}
