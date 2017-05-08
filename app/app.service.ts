import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { BookingData } from './model';

@Injectable()
export class BookingService {
	
	headers: Headers = new Headers({'content-type':'application/json'});
	auxBookingData: BookingData[];

	constructor(
		private http: Http
	) {}


	book(name: string, facility: string, startDate: number, endDate: number, duration: number, cost: number) {
		let url = `app/${facility}`;

		let data = {
			name: name,
			startDate: startDate,
			endDate: endDate,
			cost: cost,
			duration: duration
		};
		console.log(data);
		return this.http
			.post(url, data, this.headers)
			.map((response: Response) => {
				console.log(response.json());
				return response.json().data;
			});
	}


	alreadyBookedCheck(facility: string, startDate: number, endDate: number) {
		console.log("inside alreadyBookedCheck");
		let url = `app/${facility}`;
		return this.http.get(url)
			.map((response: Response) => {
				this.auxBookingData = response.json().data;
				//console.log(this.auxBookingData);
				return this.auxBookingData.some(currentBooking => {
					return ((startDate >= currentBooking.startDate && startDate < currentBooking.endDate) || (endDate > currentBooking.startDate && endDate <= currentBooking.endDate));
				});
			});
	}

	getData(facility: string) {
		let url = `app/${facility}`
		return this.http
			.get(url)
			.map((response: Response) => {
				let data = response.json().data;
				return data;
			});
	}
}

