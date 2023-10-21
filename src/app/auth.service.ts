import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

const COGNITO_HOST = "https://family-cloud.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "5hi57crpb1f2he046kf8dabc6c";
const REDIRECT_URI = "http://localhost:3000/auth/cognito/callback";
const IDENTITY_PROVIDER = "Google";
const RESPONSE_TYPE = "code";
const SCOPE = "email+openid+phone";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	constructor(private cookieService: CookieService) {}

	isLoggedIn(): boolean {
		return this.cookieService.check("token");
	}

	redirectToGoogleSignIn() {
		window.location.href = `${COGNITO_HOST}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&identity_provider=${IDENTITY_PROVIDER}`;
	}
}
