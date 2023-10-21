import { Component } from "@angular/core";
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import { AuthService } from "../auth.service";

// Create password validation function
export function createPasswordStrengthValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		// Check if password contains a number
		const hasNumber = /\d/.test(control.value);
		// Check if password contains an uppercase letter
		const hasUpper = /[A-Z]/.test(control.value);
		// Check if password contains a lowercase letter
		const hasLower = /[a-z]/.test(control.value);
		// Check if password contains a special character
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
		// Check if password is only numbers and letters
		const onlyLettersAndNumbers = /^[a-zA-Z0-9]+$/.test(control.value);

		// Check if all conditions are met
		const valid = hasNumber && hasUpper && hasLower && hasSpecial;

		// Return null if all conditions are met
		console.log("valid", valid);
		if (valid) {
			return null;
		}

		// Return error if any conditions are not met
		return {
			passwordValidator: {
				hasNumber,
				hasUpper,
				hasLower,
				hasSpecial,
			},
		};
	};
}

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
	loginForm = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(8),
			createPasswordStrengthValidator(),
		]),
	});

	showPassword = false;

	constructor(private authService: AuthService) {}

	onSubmit() {}

	onGoogleLogin() {
		// Direct to cognito login
		this.authService.redirectToGoogleSignIn();
	}

	togglePasswordVisibility(passwordInput: HTMLInputElement) {
		this.showPassword = !this.showPassword;
		passwordInput.type = this.showPassword ? "text" : "password";
	}

	displayPasswordErrorMessage() {
		const passwordControl = this.loginForm.get("password");
		if (!passwordControl) {
			return;
		}
		console.log(passwordControl.errors);
		if (passwordControl.hasError("required")) {
			return "Password is required";
		}
		if (passwordControl.hasError("minlength")) {
			return "Password must be at least 8 characters";
		}
		if (passwordControl.hasError("passwordValidator")) {
			const passwordValidator = passwordControl.getError("passwordValidator");
			if (!passwordValidator.hasNumber) {
				return "Password must contain a number";
			}
			if (!passwordValidator.hasUpper) {
				return "Password must contain an uppercase letter";
			}
			if (!passwordValidator.hasLower) {
				return "Password must contain a lowercase letter";
			}
			if (!passwordValidator.hasSpecial) {
				return "Password must contain a special character";
			}
		}
		return "";
	}
}
