import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	username = "";
	password = "";
	title = "family-cloud";

	constructor(private http: HttpClient) {}

	login(username: string, password: string) {
		this.http.post("http://localhost:3000/login", {}, {}).subscribe((res) => {
			console.log(res);
		});
	}
}
