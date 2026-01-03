import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { environment } from "../environments/environment";


export const UrlInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    return next(
        req.clone({
            url: `${environment.api_url}${req.url}`
        })
    );
}