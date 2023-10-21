import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Injectable, inject } from "@angular/core";

@Injectable({
	providedIn: "root",
})
class AuthGuard {
	constructor(private authService: AuthService) {}

	canActivate() {
		return this.authService.isLoggedIn();
	}
}

export const authGuard: CanActivateFn = (route, state) => {
	// Use Auth Service to check if user is logged in
	return inject(AuthGuard).canActivate()
		? true
		: inject(Router).createUrlTree(["/login"]);
};
