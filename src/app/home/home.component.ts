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
	// Array to store the navigation path
	path: string[] = [];
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.loading = true;
		// this.http.get("http://localhost:3000/s3/list").subscribe((res) => {
		// 	this.dataSource = (res as any).items;
		// 	this.loading = false;
		// });
		this.http
			.get("http://localhost:3000/s3/folder", { withCredentials: true })
			.subscribe((res) => {
				this.dataSource = (res as any).items;
				this.loading = false;
			});
	}

	uploadFile(event: any) {
		console.log(event.target.files);
		// get presigned url from server
		this.http
			.post(
				"http://localhost:3000/s3/upload",
				{
					file: event.target.files[0].name,
				},
				{ withCredentials: true }
			)
			.subscribe((res) => {
				console.log(res);
				const presignedUrl = (res as any).url;
				const file = event.target.files[0];
				const formData = new FormData();
				formData.append("file", file);
				this.http
					.put(presignedUrl, formData)
					.subscribe((res) => console.log(res));
			});
	}

	// Function to go back in the file tree
	goBack() {
		if (this.path.length > 0) {
			this.path.pop(); // Remove the last element (current directory)
			this.updateData();
		}
	}

	// Function to update the data source based on the current path
	updateData() {
		const prefix = this.path.join("/");
		this.http
			.get(`http://localhost:3000/s3/folder?prefix=${prefix}`, {
				withCredentials: true,
			})
			.subscribe((res) => {
				this.dataSource = (res as any).items;
				this.loading = false;
				this.dataSource.forEach((item: any) => {
					this.getFolderSize(item);
				});
			});
	}

	/**
	 * Navigate to a folder in the path stack
	 * @param folder The folder to navigate to
	 * @returns
	 */
	navigateTo(folder: string) {
		// pop all the folders until the current folder
		console.log(this.path);
		console.log(folder);
		let index = this.path.indexOf(folder);
		console.log(index);
		if (index === -1) return;
		this.path.splice(index + 1);
		this.updateData();
	}

	openFolder(folder: any) {
		// Update the data source to reflect the new folder
		if (!folder.isDir) return;
		this.path.push(folder.name);
		let prefix = this.path.join("/");
		this.http
			.get(`http://localhost:3000/s3/folder?prefix=${prefix}`, {
				withCredentials: true,
			})
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
				`http://localhost:3000/s3/folder/size?prefix=${prefix}/${folder.name}`,
				{ withCredentials: true }
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
