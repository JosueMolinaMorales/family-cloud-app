import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

export interface PeriodicElement {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}

const FILE_TREE_STRUCTURE = [
	{
		name: "Personal",
		isDir: true,
		items: [
			{
				name: "presentation.txt",
				isDir: false,
				items: [],
				size: 100,
				lastModified: "2020-01-01",
			},
		],
		size: 100,
		lastModified: "2020-01-01",
	},
	{
		name: "Work",
		isDir: true,
		items: [
			{
				name: "presentation.txt",
				isDir: false,
				items: [],
				size: 50,
				lastModified: "2020-01-01",
			},
			{
				name: "presentation2.txt",
				isDir: false,
				items: [],
				size: 50,
				lastModified: "2020-01-01",
			},
		],
		size: 100,
		lastModified: "2020-01-01",
	},
];

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
	displayedColumns: string[] = ["name", "size", "lastModified"];
	dataSource = FILE_TREE_STRUCTURE;
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		// Printout the sso query param
		console.log(window.location.search);
		this.http.get("http://localhost:3000/s3/list").subscribe((res) => {
			this.dataSource = (res as any).items as any[];
		});
	}

	openFolder(folder: any) {
		// Update the data source to reflect the new folder
		if (!folder.isDir) return;
		this.dataSource = folder.items;
	}

	convertByteToMB(byte: number) {
		return (byte / 1024 / 1024).toFixed(2);
	}
}
