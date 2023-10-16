import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {
		// Printout the sso query param
		console.log(window.location.search);
	}
}
