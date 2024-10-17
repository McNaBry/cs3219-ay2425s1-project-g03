import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user.model';
import { API_CONFIG } from '../app/api.config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private currentUser?: User;
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const isLoggedIn = this.authenticationService.userValue?.accessToken;
        const isApiUrl = request.url.startsWith(API_CONFIG.baseUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${this.currentUser!.accessToken}`),
            });
        }
        return next.handle(request);
    }
}
