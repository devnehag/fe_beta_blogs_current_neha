import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './auth-token.interceptor';
import { UserService } from './core/services/user.service';
import { AuthenticationService } from './core/services/authentication.service';
import { of } from 'rxjs';
import { NotificationService } from './core/services/notification.service';
import { User } from './shared/models/user';
import { provideAnimations } from '@angular/platform-browser/animations';

export function initializeUserData(
	userService: UserService,
	authService: AuthenticationService,
	notificationService: NotificationService
) {
	if (authService.isLoggedIn()) {
		return () =>
			userService.getBootstrapData().subscribe({
				next: (user: User) => {
					console.log(user);
					notificationService.listen(user.id);
				},
				error: () => authService.logout(),
			});
	} else {
		return () => of(null);
	}
}

export const appConfig: ApplicationConfig = {
	providers: [
    provideAnimations(),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authTokenInterceptor])),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeUserData,
			deps: [UserService, AuthenticationService, NotificationService],
			multi: true,
		},
	],
};