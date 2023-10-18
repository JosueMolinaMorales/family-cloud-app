import { DataSource } from "@angular/cdk/collections";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

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
	dataSource: any;
	loading = false;
	prefix: any[] = [];
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.loading = true;
		// this.http.get("http://localhost:3000/s3/list").subscribe((res) => {
		// 	this.dataSource = (res as any).items;
		// 	this.loading = false;
		// });
		this.http.get("http://localhost:3000/s3/folder").subscribe((res) => {
			this.dataSource = (res as any).items;
			this.loading = false;
		});
	}

	openFolder(folder: any) {
		// Update the data source to reflect the new folder
		// if (!folder.isDir) return;
		// this.dataSource = folder.items;
		this.prefix.push(folder.name);
		let prefix = this.prefix.join("/");
		this.http
			.get(`http://localhost:3000/s3/folder?prefix=${prefix}`)
			.subscribe((res) => {
				this.dataSource = (res as any).items;
				console.log(this.dataSource);
				this.loading = false;
				this.dataSource.forEach((item: any) => {
					this.getFolderSize(item);
				});
			});
	}

	getFolderSize(folder: any) {
		if (!folder.isDir) return;
		let prefix = this.prefix.join("/");
		this.http
			.get(
				`http://localhost:3000/s3/folder/size?prefix=${prefix}/${folder.name}`
			)
			.subscribe((res) => {
				folder.size = (res as any).size;
				console.log(folder);
			});
	}

	convertByteToMB(byte: number) {
		return (byte / 1024 / 1024).toFixed(2);
	}
}
