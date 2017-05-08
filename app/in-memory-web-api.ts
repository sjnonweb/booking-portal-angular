import { InMemoryDbService } from 'angular-in-memory-web-api';

export class FacilityBookingData implements InMemoryDbService {
	createDb() {
		let gym: any = [

		];
		let clubhouse: any = [

		];
		let tennis: any = [
		
		];

		return {tennis, gym, clubhouse};
	}
}