import { Component } from '@angular/core';
import { OnInit } from '@angular/core'

import { BookingData } from './model';
import { BookingService } from './app.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit  {
  
  name: string = "";
  startDate: string;
  startTime: string;
  duration: number;
  durationRange: number = 13;
  facility: string;
  error: boolean= false;
  success: boolean = false;
  alreadyBooked: boolean;
  pastBooking: boolean;
  currDate: Date;
  facilityNotSelected: boolean = true;
  auxBookingData: BookingData[];
  gymTimeSlot: number[] = [10,11,12,13,14,15,16,17,18,19,20,21];
  clubTimeSlot: number[] = [10,16];
  tennisTimeSlot: number[] = [10,11,12,13,14,15,16,17,18,19,20,21];
  durationArray: number[];
  currSlot: number[];
  gymData: BookingData[];
  clubData: BookingData[];
  tennisData: BookingData[];
  currentBooking: BookingData;

  gymPrice: number = 50;
	clubRegPrice: number = 100;
  clubExecPrice: number = 500;
	tennisPrice: number = 50;

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit() {

    this.currDate = new Date();

    this.bookingService.getData("gym")
      .subscribe(
        data => {
          this.gymData = data;
        },
        error => {
          console.log("error happened: ", error);
        }
      );
    
    this.bookingService.getData("clubhouse")
      .subscribe(
        data => {
          this.clubData = data;
        },
        error => {
          console.log("error happened: ", error);
        }
      );

    this.bookingService.getData("tennis")
      .subscribe(
        data => {
          this.tennisData = data;
        },
        error => {
          console.log("error occurred: ", error);
        }
      );
  }

  book() {
    if(this.name.trim() == "" || this.startDate == null || this.startTime == "" || this.facility == "")
    {
      this.error = true;
      this.success = false;
      return 0;
    }

    this.error = false;
    let startDateArray = this.startDate.split('-');
    let startTime: number = +this.startTime;
    let startDate: number = new Date(+startDateArray[0],+startDateArray[1]-1,+startDateArray[2],startTime,0).getTime();
    let endTime: number = startTime + (+this.duration);
    let endDate: number = new Date(+startDateArray[0],+startDateArray[1]-1,+startDateArray[2],endTime,0).getTime();
    let name: string = this.name.trim();
    
    if(this.currDate.getTime() >= startDate) {
      this.pastBooking = true;
      return 0;
    }


    this.bookingService.alreadyBookedCheck(this.facility, startDate, endDate)
      .subscribe(
        data => {
          this.alreadyBooked = data;
          this.success = false;
          if (data) {
            //console.log("slot already booked");
            this.pastBooking = false;
            alert("Slot already booked!")
            return 0;
          }
          else {
            let cost: number;
            switch (this.facility) {
              case 'gym':
                cost = this.gymPrice * this.duration;
                break;
              case 'clubhouse':
                if(this.startTime == "10")
                  cost = this.clubRegPrice * this.duration;
                else
                  cost = this.clubExecPrice * this.duration;
                break;
              case 'tennis':
                cost = this.tennisPrice * this.duration;
                break;
            }
            this.bookingService
              .book(name, this.facility, startDate, endDate, this.duration, cost)
              .subscribe(
              data => {
                if (this.facility == "gym") {
                  this.gymData.push(data);
                  this.currentBooking = data;
                }
                if (this.facility == "clubhouse") {
                  this.clubData.push(data);
                  this.currentBooking = data;

                }
                if (this.facility == "tennis") {
                  this.tennisData.push(data);
                  this.currentBooking = data;
                }

                this.name = "";
                this.startDate = "";
                this.startTime = "";
                this.duration = null;
                this.facility = "";
                this.pastBooking = false;
                this.success = true;
              },
              error => {
                console.log("error occurred:", error);
              }
              );
          }
        },
        error => {
          console.log("error occurred: ", error);
        }
      );  
  }

  createRange(max: number) {
    let arr: number[] = [];
    for (let i=1; i<=max; i++) {
      arr.push(i);
    }
    return arr;
  }

  durationUpdate() {
    switch(this.facility) {
      case 'gym':
        console.log("something");
        this.durationArray = this.createRange(22 - (+this.startTime));
        break;
      case 'clubhouse':
        console.log("clubhouse");
        this.durationArray = [6];
        break;
      case 'tennis':
        console.log("tennis");
        this.durationArray = this.createRange(22 - (+this.startTime));
        break;
    }
  }

  timeSlotUpdate() {
    this.facilityNotSelected = false;
    this.success = false;
    this.pastBooking = false;
    this.startTime = "";
    switch(this.facility) {
      case 'gym':
        this.currSlot = this.gymTimeSlot;
        break;
      case 'clubhouse':
        this.currSlot = this.clubTimeSlot;
        break;
      case 'tennis':
        this.currSlot = this.tennisTimeSlot;
        break;
    }
  }

}
